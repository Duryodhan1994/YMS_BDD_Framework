package utils;

import org.openqa.selenium.WebDriver;
import pageFactory.LoginPage;

public class SharedContext {

    private WebDriver driver;
    private String testCaseId;
    private String testName;
    private String browser;
    private String buildName;
    private Throwable scenarioError;
    private String projectName;
    private boolean shouldSkip = true;

    private LoginPage loginPage;

    public SharedContext() { }

    // WebDriver
    public WebDriver getDriver() {
        return driver;
    }
    public void setDriver(WebDriver driver) {
        this.driver = driver;
    }

    // Test Case ID
    public String getTestCaseId() {
        return testCaseId;
    }
    public void setTestCaseId(String testCaseId) {
        this.testCaseId = testCaseId;
    }

    // Test Name
    public String getTestName() {
        return testName;
    }
    public void setTestName(String testName) {
        this.testName = testName;
    }

    // Browser
    public String getBrowser() {
        return browser;
    }
    public void setBrowser(String browser) {
        this.browser = browser;
    }

    // Build Name
    public String getBuildName() {
        return buildName;
    }
    public void setBuildName(String buildName) {
        this.buildName = buildName;
    }

    // Project Name
    public String getProjectName() {
        return projectName;
    }
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    // Scenario Skip Flag
    public boolean shouldSkipScenario() {
        return shouldSkip;
    }
    public void markScenarioToSkip() {
        this.shouldSkip = true;
    }

    // Scenario Error
    public Throwable getScenarioError() {
        return scenarioError;
    }
    public void setScenarioError(Throwable t) {
        this.scenarioError = t;
    }

    // Page Object: LoginPage
    public LoginPage getLoginPage() {
        return loginPage;
    }
    public void initializePageObject(WebDriver driver) {
        this.loginPage = new LoginPage(driver);
    }
}
