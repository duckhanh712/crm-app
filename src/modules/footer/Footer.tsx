import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="container-fluid clearfix">
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
            Handle crawl from MCG <img src="/logo.png" alt="logo" />
          </span>
        </div>
      </footer>
    );
  }
}
