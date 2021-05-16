import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import localStorage from "local-storage";
import { Table, Modal as Antmodal} from "antd";
import "antd/dist/antd.css";
import Modal from "react-modal";
import { Editor } from "@tinymce/tinymce-react";
import styled from 'styled-components';

function App() {

  const jobcolumns = [];
  for (let i = 1; i <= 5; i++) {
    const term1 = "Job" + i;
    const term2 = "job" + i;
    jobcolumns.push({
      title: term1,
      dataIndex: term2,
    });
  }

  const customStyles = {
    content: {
      width: "60%",
      height: "60%",
      bottom:"15",
      right:"5",
      position: "absolute",
    },
  };

  const Paging = styled(Table)`
    .ant-table-pagination-right{
      justify-content: flex-start;
    }
  `

  const [data, setData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isPreview, setPreview] = useState(false);
  const [template, setTemplate] = useState("");

  const handleJD = () => {
    fetch(process.env.PUBLIC_URL + "/assets/ANSTest_Datasets.xlsx")
      .then((response) => {
        console.log(response);
        return response.arrayBuffer();
      })
      .then((ab) => {
        var data = new Uint8Array(ab);
        var workbook = XLSX.read(data, {
          type: "array",
        });

        var second_sheet_name = workbook.SheetNames[1];
        console.log(second_sheet_name);
        var worksheet = workbook.Sheets[second_sheet_name];
        var _JsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        console.log(_JsonData);

        localStorage.set("job", _JsonData);
      });
  };

  const handleTalent = () => {
    fetch(process.env.PUBLIC_URL + "/assets/ANSTest_Datasets.xlsx")
      .then((response) => {
        console.log(response);
        return response.arrayBuffer();
      })
      .then((ab) => {
        var data = new Uint8Array(ab);
        var workbook = XLSX.read(data, {
          type: "array",
        });

        var first_sheet_name = workbook.SheetNames[0];
        console.log(first_sheet_name);
        var worksheet = workbook.Sheets[first_sheet_name];
        var _JsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        console.log(_JsonData);

        localStorage.set("talent", _JsonData);
      });
  };

  const handleLoadData = () => {

    if(!localStorage.get("talent") || !localStorage.get("job")){
      warning();
      return;
    }

    const talentJson = localStorage.get("talent");
    const jobJson = localStorage.get("job");

    const talents = Object.values(talentJson);
    const jobs = Object.values(jobJson);

    const matchList = [];
    talents.forEach(
      (
        {
          Talent_Name,
          Location,
          IOM,
          Seniority,
          TechStack,
          Email,
          LinkedInURL,
        },
        index
      ) => {
        const matchJobs = jobs.filter((job) => {
          return (
            job.Location === Location &&
            job.IOM === IOM &&
            job.Seniority === Seniority &&
            job.TechStack === TechStack
          );
        });

        if (matchJobs.length < 3 || matchJobs.length > 5) return;

        const person = {
          key: index,
          name: Talent_Name,
          email: Email,
          location: Location,
          seniority: Seniority,
          techStack: TechStack,
          iom: IOM,
          linkedinurl: LinkedInURL,
        };

        const jsonJob = {};
        //const jobName = {};
        for (let i = 1; i <= matchJobs.length; i++) {
          jsonJob["job" + i] = 
                  {'url' : matchJobs[i - 1]["JobURL"], 
                   'location' : matchJobs[i - 1]["Location"],
                   'company' :  matchJobs[i - 1]["Company"],
                   'jobname' :  matchJobs[i - 1]["Job Name"],
                  }
        }
        Object.assign(person, jsonJob);
        matchList.push(person);
      }
    );

    console.log(matchList);
    setData(matchList);
  };

  const handlePreview = (preview) => {
    console.log(preview);
    
    const jobs = Object.entries(preview).filter(([key,val]) => { return key.includes('job');});
    
    const jobstag = [];
    jobs.forEach(([key,val],index) => {
      console.log(key);
      console.log(val);

      const tags = 
            <p>{index+1}. {val['jobname']} {val['company']} {val['location']}
            <br/>
            <a href={val['url'] } target="_blank" rel="noreferrer">Link</a>
            </p>

      jobstag.push(tags);
    });

    const content = 
      <React.Fragment>
          <p> Hi {preview.name.split(" ")[0]}</p>
          <p>This is Kirby who has connected with you on LinkedIn several days ago.
            I would like to share the open opportunities that could be a good match for you.  
            Meanwhile, I’d love to send the job openings that could be a good fit along with our insights to you every week. 
            Hope the information could help you more with your career choice.
          </p>
          {jobstag}
          <p>Best,<br/>Kirby</p>
      </React.Fragment>
    

     setPreview(true);
     setContent(content);
     setIsOpen(true);
  };

  const openTemplate = () => {
    setIsOpen(true);
    setPreview(false);
    const template = 
            "<p> Hi [First Name]</p>" +
            "<p>This is Kirby who has connected with you on LinkedIn several days ago." +
              "I would like to share the open opportunities that could be a good match for you." +  
              "Meanwhile, I’d love to send the job openings that could be a good fit along with our insights to you every week." + 
              "Hope the information could help you more with your career choice." +
            "</p>" +
            "<p>1. [Job Name]   [Company]   [Location]    [URL…..]</p>" +
            "<p>2. [Job Name]   [Company]   [Location]    [URL…..]</p>" +
            "<p>3. [Job Name]   [Company]   [Location]    [URL…..]</p>" +
            "<p>4. [Job Name]   [Company]   [Location]    [URL…..]</p>" +
            "<p>5. [Job Name]   [Company]   [Location]    [URL…..]</p>" +
            "<p>Best,<br/>Kirby</p>"

    setTemplate(template);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  function warning() {
    Antmodal.warning({
      title: 'Warning',
      content: 'Please Import Talent Dataset and Job Dataset',
    });
  }

  return (
    <>
      <button onClick={handleTalent}>Telents Import</button>
      <button onClick={handleJD}>JD Import</button>
      <button onClick={handleLoadData}>Load Data</button>
      <button onClick={openTemplate}>Template</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {isPreview ?
        (
          <>{content}</>
        ):(
          <>
          <Editor
            apiKey="dx5nnwdnxbmuu0kfncvttey1349oagaopcrb2fenzftaamvj"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={template}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | " +
                "bold italic backcolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
          <button onClick={log}>Log editor content</button>
          </>
        )}
      </Modal>
      <Paging dataSource={data} pagination={{ pageSize: 5}} scroll={{ y: 350, x: 1200}}>
        <Table.Column width="9%" title="Talent_Name" dataIndex="name" />
        <Table.Column width="7%" title="Email" dataIndex="email" />
        <Table.Column width="7%" title="Location" dataIndex="location" />
        <Table.Column width="7%" title="Seniority" dataIndex="seniority" />
        <Table.Column width="8%" title="TechStack" dataIndex="techStack" />
        <Table.Column width="7%" title="IOM" dataIndex="iom" />
        {jobcolumns.map(({ title, dataIndex }, index) => (
          <Table.Column
            width="6%"
            title={title}
            dataIndex={dataIndex}
            render={function (text) {
              console.log(text);
              if (typeof text !== "undefined") {
                return (
                  <a href={text['url']} target="_blank" rel="noreferrer">
                    J{index + 1}URL
                  </a>
                );
              } else {
                return <div></div>;
              }
            }}
          />
        ))}
        <Table.Column
          title="LinkedInURL"
          dataIndex="linkedinurl"
          render={(text) => (
            <a href={text} target="_blank" rel="noreferrer">
              {text}
            </a>
          )}
        />
        <Table.Column
          width="7%"
          title="Preview"
          key="preview"
          fixed='right'
          render={(record) => (
            <button style={{width:'90%'}} onClick={() => handlePreview(record)}>PRVW</button>
          )}
        />
      </Paging>
      <button>Send</button>
    </>
  );
}

export default App;
