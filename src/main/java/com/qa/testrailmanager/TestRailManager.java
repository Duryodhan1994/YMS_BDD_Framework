package com.qa.testrailmanager;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

import com.gurock.testrail.APIClient;
import com.gurock.testrail.APIException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class TestRailManager {

	public static int TEST_CASE_PASS_STATUS = 1;
	public static int TEST_CASE_FAIL_STATUS = 5;
	public static String TEST_RAIL_USERNAME;
	public static String TEST_RAIL_PASSWORD;
	public static String TEST_RAIL_ENGINE_URL = "https://tmfl.testrail.io/";
	private static APIClient apiClient;

	// Structure: caseId -> {runId, title, browser, planId, projectName, build}
	private static Map<String, Map<String, String>> testCaseMap = new HashMap<>();

	private static void loadTestRailCredentials() throws IOException {
		if (apiClient != null) return;
		TEST_RAIL_USERNAME = getGlobalValue("TESTRAILUSERNAME");
		TEST_RAIL_PASSWORD = getGlobalValue("TESTRAILPASSWORD");

		apiClient = new APIClient(TEST_RAIL_ENGINE_URL);
		apiClient.setUser(TEST_RAIL_USERNAME);
		apiClient.setPassword(TEST_RAIL_PASSWORD);
	}

	public static String getGlobalValue(String key) throws IOException {
		Properties prop = new Properties();
		FileInputStream fis = new FileInputStream(System.getProperty("user.dir") + "/src/test/java/resources/global.properties");
		prop.load(fis);
		return prop.getProperty(key);
	}

	public static void initializeTestCasesFromPlan() {
		try {
			loadTestRailCredentials();
			String testPlanId = getGlobalValue("TESTPLANID");

			JSONObject plan = (JSONObject) apiClient.sendGet("get_plan/" + testPlanId);
			JSONArray entries = (JSONArray) plan.get("entries");

			// Extract build name from plan's name field
			String build = plan.get("name").toString();

			// Extract project name
			String projectId = plan.get("project_id").toString();
			JSONObject project = (JSONObject) apiClient.sendGet("get_project/" + projectId);
			String projectName = project.get("name").toString();

			for (Object entryObj : entries) {
				JSONObject entry = (JSONObject) entryObj;
				JSONArray runs = (JSONArray) entry.get("runs");

				for (Object runObj : runs) {
					JSONObject run = (JSONObject) runObj;
					String runId = run.get("id").toString();

					// Extract browser info from "config" field, default to "chrome"
					String browser = run.containsKey("config") ? run.get("config").toString() : "chrome";

					// Get the list of test cases in the run
					Object testResponse = apiClient.sendGet("get_tests/" + runId);

					if (testResponse instanceof JSONObject) {
						JSONObject responseObj = (JSONObject) testResponse;
						JSONArray tests = (JSONArray) responseObj.get("tests");

						if (tests != null) {
							for (Object testObj : tests) {
								JSONObject test = (JSONObject) testObj;
								String caseId = test.get("case_id").toString();
								String title = test.get("title").toString();

								Map<String, String> data = new HashMap<>();
								data.put("runId", runId);
								data.put("title", title);
								data.put("browser", browser);
								data.put("planId", testPlanId);
								data.put("projectName", projectName);
								data.put("build", build);

								testCaseMap.put(caseId, data);
							}
						} else {
							System.err.println("No 'tests' array found in response for run ID: " + runId);
						}
					} else {
						System.err.println("Unexpected response type for run ID: " + runId);
					}
				}
			}

			System.out.println("Test case map loaded with " + testCaseMap.size() + " cases.");

		} catch (IOException | APIException e) {
			System.err.println("Error initializing from Test Plan: " + e.getMessage());
		}
	}


	public static Map<String, Map<String, String>> getTestCasesFromPlan() {
		return testCaseMap;
	}

	public static Map<String, String> getProjectAndBuildForCase(String caseId) {
		if (testCaseMap.containsKey(caseId)) {
			Map<String, String> data = testCaseMap.get(caseId);
			Map<String, String> result = new HashMap<>();
			result.put("projectName", data.getOrDefault("projectName", "DefaultProject"));
			result.put("buildName", data.getOrDefault("build", "DefaultBuild"));
			result.put("browser", data.getOrDefault("browser", "DefaultBrowser"));
			return result;
		} else {
			System.err.println("⚠️ No mapping found for Case ID: " + caseId);
			return null;
		}
	}

	public static void postResultToTestRail(String caseId, int status, String message) throws IOException {
		try {
			loadTestRailCredentials();
			if (!testCaseMap.containsKey(caseId)) {
				System.err.println("⚠️ Cannot post result. Unknown Case ID: " + caseId);
				return;
			}

			String runId = testCaseMap.get(caseId).get("runId");

			Map<String, Object> data = new HashMap<>();
			data.put("status_id", status);
			data.put("comment", message);

			apiClient.sendPost("add_result_for_case/" + runId + "/" + caseId, data);
			System.out.printf("Posted result for case %s in run %s%n", caseId, runId);

		} catch (APIException e) {
			System.err.println("Error posting result: " + e.getMessage());
		}
	}
}
