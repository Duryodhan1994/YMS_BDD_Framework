package utils;

import com.qa.testrailmanager.TestRailManager;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.junit.Assume;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Collection;
import java.util.Map;

public class Hooks {

    private final SharedContext context;
    private final BaseClass base = new BaseClass();

    public Hooks(SharedContext context) {
        this.context = context;
    }

    @Before
    public void beforeScenario(Scenario scenario) {
        Collection<String> tags = scenario.getSourceTagNames();
        String testCaseId = null;

        for (String tag : tags) {
            if (tag.startsWith("@C")) {
                testCaseId = tag.replace("@C", "").trim();

                try {
                    testCaseId = String.valueOf(Integer.parseInt(testCaseId));
                } catch (NumberFormatException e) {
                    System.err.println("Invalid test case ID format in tag: " + tag);
                }

                context.setTestCaseId(testCaseId);
                break;
            }
        }

        context.setTestName(scenario.getName());
        TestRailManager.initializeTestCasesFromPlan();

        Map<String, String> runInfo = null;

        if (testCaseId != null) {
            runInfo = TestRailManager.getProjectAndBuildForCase(testCaseId);
            if (runInfo == null) {
                Assume.assumeTrue("Skipping scenario because test case not mapped in TestRail", false);
            } else {
                System.out.println("Mapped run info: " + runInfo);
            }
        } else {
            System.out.println("⚠️ No test case ID found in scenario tags.");
        }

        // ==== Initialize WebDriver and Page Objects ====
        try {
            String testName = context.getTestName();
            String projectName = getValueOrDefault(runInfo, "projectName", context.getProjectName(), "DefaultProject");
            String buildName = getValueOrDefault(runInfo, "buildName", context.getBuildName(), "DefaultBuild");

            WebDriver driver = base.initializeDriver(projectName, buildName, testName);
            context.setDriver(driver);
            context.initializePageObject(driver);

            System.out.println("✅ Driver and page objects initialized for scenario: " + scenario.getName());

        } catch (Exception e) {
            System.err.println("❌ Error during driver initialization: " + e.getMessage());
            Assume.assumeTrue("Failed to initialize driver", false);  // skip the scenario if setup fails
        }
    }

    private String getValueOrDefault(Map<String, String> map, String mapKey, String contextValue, String defaultValue) {
        if (map != null && map.get(mapKey) != null) return map.get(mapKey);
        if (contextValue != null) return contextValue;
        return defaultValue;
    }


    @After
    public void afterScenario(Scenario scenario) {
        WebDriver driver = context.getDriver();
        String testCaseId = context.getTestCaseId();

        String status = "passed";
        String comment;

        try {
            if (scenario.isFailed()) {
                status = "failed";
                Throwable error = context.getScenarioError();

                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                if (error != null) {
                    error.printStackTrace(pw);
                    String fullStackTrace = sw.toString();

                    // get the console
                    String trimmedTrace = fullStackTrace;
                    int cutoffIndex = fullStackTrace.indexOf("Driver info:");
                    if (cutoffIndex != -1) {
                        trimmedTrace = fullStackTrace.substring(0, cutoffIndex).trim();
                    }

                    comment = "FAILED: " + error.getMessage();
                    comment += "\n\n--- Stack Trace (trimmed) ---\n" + trimmedTrace;
                } else {
                    comment = "FAILED: @@ Test case Failed! @@";
                }
            } else {
                comment = "PASSED:: " + scenario.getSourceTagNames() + ": @@ Test case executed successfully! @@";
            }

            comment += "\nScenario: " + scenario.getName();
            comment += "\nTags: " + scenario.getSourceTagNames();

            System.out.println(comment);

            if (driver instanceof JavascriptExecutor) {
                ((JavascriptExecutor) driver).executeScript("lambda-status=" + status);
            }

            if (testCaseId != null && !testCaseId.isEmpty()) {
                if ("passed".equals(status)) {
                    base.TestRailPassUpdate(testCaseId, comment);
                } else {
                    base.TestRailFailUpdate(testCaseId, comment);
                }
            }

        } catch (Exception e) {
            System.err.println("Error in afterScenario: " + e.getMessage());
        } finally {
            if (driver != null) {
                driver.quit();
                System.out.println("Driver quit after scenario: " + scenario.getName());
            }
        }
    }

}
