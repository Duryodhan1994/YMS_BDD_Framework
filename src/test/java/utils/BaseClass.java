package utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.devtools.DevTools;
import org.openqa.selenium.remote.RemoteWebDriver;

import com.qa.testrailmanager.TestRailManager;

public class BaseClass {
	private WebDriver driver = null;

	// Initialize TestRail test cases once on class load
	static {
		TestRailManager.initializeTestCasesFromPlan();
	}

	public WebDriver initializeDriver(String projectName, String buildName, String testName) throws IOException {
		if (driver != null) return driver;

		String browser = getglobalValue("TestBrowserForUIAutomation");
		String driverType = getglobalValue("TestDriver");
		String username = getglobalValue("username");
		String accessKey = getglobalValue("access");
		String tunnelName = getglobalValue("tunnelName");
		String gridURL = "@hub.lambdatest.com/wd/hub";

		if ("Local".equalsIgnoreCase(driverType)) {
			System.out.println("========== Local WebDriver Initialization ==========");

			if ("GoogleChrome".equalsIgnoreCase(browser)) {
				String projectPath = System.getProperty("user.dir");
				System.setProperty("webdriver.chrome.driver", projectPath + "/src/test/resources/drivers/chromedriver.exe");

				ChromeOptions options = new ChromeOptions();
				driver = new ChromeDriver(options);

				DevTools devTools = ((ChromeDriver) driver).getDevTools();
				devTools.createSession();

				Map<String, Object> networkConditions = new HashMap<>();
				networkConditions.put("offline", false);
				networkConditions.put("latency", 10);
				networkConditions.put("downloadThroughput", 2500);
				networkConditions.put("uploadThroughput", 2000);
				// ((ChromeDriver) driver).executeCdpCommand("Network.emulateNetworkConditions", networkConditions);

				System.out.println("Local Chrome WebDriver initialized.");
			} else {
				System.out.println("Browser " + browser + " support not implemented yet for local driver.");
			}
		} else {
			System.out.println("========== Remote WebDriver Initialization ==========");

			ChromeOptions browserOptions = new ChromeOptions();
			browserOptions.setPlatformName("Windows 10");
			browserOptions.setBrowserVersion("119.0");

			Map<String, Object> ltOptions = new HashMap<>();
			ltOptions.put("username", username);
			ltOptions.put("accessKey", accessKey);
			ltOptions.put("video", true);
			ltOptions.put("network", true);
			ltOptions.put("build", buildName);
			ltOptions.put("project", projectName);
			ltOptions.put("name", testName);
			ltOptions.put("tunnel", false);
			ltOptions.put("w3c", true);
			ltOptions.put("plugin", "java-testNG");

			browserOptions.setCapability("LT:Options", ltOptions);

			try {
				driver = new RemoteWebDriver(new URL("https://" + username + ":" + accessKey + gridURL), browserOptions);
				System.out.println("Remote WebDriver initialized.");

				// IMPORTANT: manage waits and window after driver is created
				driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
				driver.manage().window().maximize();

				return driver;
			} catch (MalformedURLException e) {
				System.err.println("Invalid LambdaTest grid URL: " + e.getMessage());
				throw new IOException("Malformed LambdaTest URL", e);
			} catch (Exception e) {
				System.err.println("Failed to initialize remote WebDriver: " + e.getMessage());
				throw new IOException("Remote driver setup failed", e);
			}
		}

		driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
		driver.manage().window().maximize();
		return driver;
	}

	// Reads from global.properties
	public static String getglobalValue(String key) throws IOException {
		Properties prop = new Properties();
		String projectPath = System.getProperty("user.dir");
		FileInputStream fis = new FileInputStream(projectPath + "/src/test/java/resources/global.properties");
		prop.load(fis);
		return prop.getProperty(key);
	}

	// Post test pass result to TestRail using your TestRailManager
	public void TestRailPassUpdate(String testCaseId, String message) {
		try {
			int status = TestRailManager.TEST_CASE_PASS_STATUS;
			TestRailManager.postResultToTestRail(testCaseId, status, message);
		} catch (IOException e) {
			System.err.println("Error updating TestRail (pass): " + e.getMessage());
		}
		System.out.println("TestRailPassUpdate called for testCaseId: " + testCaseId);
	}

	// Post test fail result to TestRail using your TestRailManager
	public void TestRailFailUpdate(String testCaseId, String message) {
		try {
			int status = TestRailManager.TEST_CASE_FAIL_STATUS;
			TestRailManager.postResultToTestRail(testCaseId, status, message);
		} catch (IOException e) {
			System.err.println("Error updating TestRail (fail): " + e.getMessage());
		}
		System.out.println("TestRailFailUpdate called for testCaseId: " + testCaseId);
	}

	// Optional: quit driver and clear reference
	public void quitDriver() {
		if (driver != null) {
			driver.quit();
			driver = null;
			System.out.println("Driver quit and cleaned up.");
		}
	}
}
