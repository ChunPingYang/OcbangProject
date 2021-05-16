import * as XLSX from 'xlsx';
import React from "react";
import ReactDOM from "react-dom";

class Testxlsx extends React.Component {
  constructor(props) {
    super(props);
    this.state = { html: "<b>SheetJS</b>" };
  }
  componentDidMount() {
    fetch("./assets/file_example_XLS_10.xls")
      .then(res => res.arrayBuffer())
      .then(ab => {
        const wb = XLSX.read(ab, { type: "array" });
        const ws = wb.Sheets["Sheet JS"];
        const html = XLSX.utils.sheet_to_html(ws);
        this.setState({ html });
      });
  }
  render() {
    console.log(this.state.html);
    return (
      <div
        dangerouslySetInnerHTML={{ __html: this.state.html }}
      />
    );
  }
}

export default Testxlsx;