import React, { Component } from "react";

import { Crisp } from "crisp-sdk-web";

class CrispChat extends Component {
  componentDidMount() {
    Crisp.configure("c138f867-61c9-42b4-b94b-d1d843a92524");
  }

  render() {
    return null;
  }
}
export default CrispChat;
