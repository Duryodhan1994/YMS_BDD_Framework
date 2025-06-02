package stepDefinitions;

import io.cucumber.java.en.*;
import lombok.extern.log4j.Log4j2;
import org.openqa.selenium.WebDriver;
import utils.BaseClass;
import utils.SharedContext;

@Log4j2
public class LoginWithAgency {
    WebDriver driver;
    private final SharedContext context;

    public LoginWithAgency(SharedContext context) {
        this.context = context;
    }

    @Given("Customer is on {string} Page")
    public void customerIsOnPage(String loginURL) {
            driver = context.getDriver();
            driver.get(loginURL);
            log.info("Navigated to login URL: {}", loginURL);
    }

    @When("Customer will enter UserID {string} and Password {string}")
    public void customerEntersCredentials(String userID, String password) {
        try {
            context.getLoginPage().clickOnLogin();
            context.getLoginPage().login(userID, password);
            log.info("Customer is entering credentials");
        }
        catch(Throwable e)
        {
            context.setScenarioError(e);
        }

    }

    @And("Customer will Click on Login")
    public void customerClicksLogin() {
        context.getLoginPage().clickOnLoginButton();
        log.info("Login button clicked.");
    }

    @Then("Customer will be Redirected to the dashboard Page")
    public void customerRedirectedToDashboard() {
        String expectedUrlPart = "https://yms-dev.api.tmf.co.in/";
        String actualUrl = context.getDriver().getCurrentUrl();
        log.info("Redirected to URL: {}", actualUrl);
        assert actualUrl.contains(expectedUrlPart) : "User not redirected to dashboard.";
    }
}
