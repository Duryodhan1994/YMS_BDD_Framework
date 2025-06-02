package cucumber.Options;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.junit.*;


@RunWith(Cucumber.class)
@CucumberOptions(features="src/test/java/features/",
				glue={"stepDefinitions","utils"},
				plugin = {"pretty", "html:target/Reports/HtmlReports.html"
				},
//		        tags=("@C63445"),
				tags=("@C63445 or @C63444 or @C63442 or @C63443"),
		        monochrome=true
				)
public class TestRunner { 
	
}
