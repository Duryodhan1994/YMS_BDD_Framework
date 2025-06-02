@C63445
Feature: To Login with Valid Username & Password

  Scenario Outline: To Login with Valid Username & Password
    Given Customer is on "<LoginURL>" Page
    When Customer will enter UserID "<UserID>" and Password "<Password>"
    And Customer will Click on Login
    Then Customer will be Redirected to the dashboard Page

    Examples:
      | LoginURL									  | UserID     | Password    |
      | https://yms-dev.api.tmf.co.in/#/ | 41695 | Welcome123 |