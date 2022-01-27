import React from "react";
import "./Home.css";
export default () => {
  return (
    <div style={{ textAlign: "left", padding: "3rem" }}>
      <p>Hello and welcome,</p>
      <p>
        I go by the nicknames of <i>Ucat</i> and <i>Fon</i> and i've been
        building this tool on my spare time. You can contact me using discord,
        my handle is Fon#2880
      </p>
      <p>
        <b>Json viewer</b> is where you can download the raw files i use on this
        tool to check raw data or to create your own tool.
      </p>
      <p>
        <b>All items</b> is where you can find all items on the game as well as
        their recipes. It also allows you to input item prices and uses the
        recipe data to help you calculate your price for items. I got this data
        using the&nbsp;
        <a href="https://github.com/ZeelNightwolf/EcoDataExporter">
          EcoDataExporter
        </a>
        &nbsp;plugin.
      </p>
      <p>
        This is very much a work in progress and more sections should be added
        later.
      </p>
      <p>So stay tuned. And i hope you enjoy it</p>
      <br />
      <br />
      <div className="changelog">
        <h2>Latest changes</h2>
        <h3>1.5.0 (2021-07-30)</h3>
        <h4>Features</h4>
        <ul>
          <li>Added simple view on recipe popup</li>
        </ul>
        <h3>1.4.1 (2021-07-10)</h3>
        <h4>Fixes</h4>
        <ul>
          <li>Visual fixes and improvements</li>
          <li>Fixed profession filter</li>
          <li>Fix for when tags can't be fetched from database</li>
        </ul>
      </div>
    </div>
  );
};
