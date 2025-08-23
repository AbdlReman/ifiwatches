import React from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import RecurringCountDown from "../../wrappers/countdown/RecurringCountDown";

const TestCountdown = () => {
  return (
    <LayoutOne headerTop="visible">
      <SEO titleTemplate="Test Countdown - IFILifestyle" />
      
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mb-5">Recurring Countdown Test</h1>
            <p className="text-center mb-4">
              This countdown automatically resets every 10 days. 
              The countdown persists across browser sessions using localStorage.
            </p>
          </div>
        </div>
      </div>

      {/* Test the recurring countdown */}
      <RecurringCountDown
        spaceTopClass="pt-50"
        spaceBottomClass="pb-50"
        bgImg="/assets/img/bg/bg.png"
        cycleDays={10}
      />

      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info">
              <h5>How it works:</h5>
              <ul>
                <li>The countdown starts at 10 days from the current date</li>
                <li>When it reaches zero, it automatically resets to another 10 days</li>
                <li>The target date is stored in localStorage, so it persists across browser sessions</li>
                <li>If you refresh the page or close and reopen the browser, the countdown continues from where it left off</li>
                <li>This creates a perpetual "Deal of the Day" that never ends</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LayoutOne>
  );
};

export default TestCountdown; 