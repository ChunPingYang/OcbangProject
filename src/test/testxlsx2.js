import React from 'react';
import * as XLSX from 'xlsx';
import localStorage from 'local-storage';

function Testxlsx(){

    const handleJD = () => {
        fetch(process.env.PUBLIC_URL+'/assets/ANSTest_Datasets.xlsx')
        .then((response) =>{
            console.log(response)
            return response.arrayBuffer();
        })
        .then((ab) => {
            var data = new Uint8Array(ab);
            var workbook = XLSX.read(data, {
                type: "array"
            });

                var second_sheet_name = workbook.SheetNames[1];
                console.log(second_sheet_name);
                var worksheet = workbook.Sheets[second_sheet_name];
                var _JsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                console.log(_JsonData);

                localStorage.set("job",_JsonData);
        });
    }
    
    const handleTalent = () => {

        fetch(process.env.PUBLIC_URL+'/assets/ANSTest_Datasets.xlsx')
        .then((response) =>{
            console.log(response)
            return response.arrayBuffer();
        })
        .then((ab) => {
            var data = new Uint8Array(ab);
            var workbook = XLSX.read(data, {
                type: "array"
            });

                var first_sheet_name = workbook.SheetNames[0];
                console.log(first_sheet_name);
                var worksheet = workbook.Sheets[first_sheet_name];
                var _JsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                console.log(_JsonData);

                localStorage.set("talent",_JsonData);
        });
    }

    const handleLoadData = () => {
        const talentJson = localStorage.get("talent");
        const jobJson = localStorage.get("job");
        
        // Object.values(talentJson).map((row) => {
        //     //console.log(row);
            
        //     Object.values(jobJson).map((row) => {
        //         //console.log(row);
                
        //     });
        // });

        let list = {};
        const talents = Object.values(talentJson);
        const jobs = Object.values(jobJson);
        //console.log(talents);
        talents.filter(({Talent_Name, Location, IOM, Seniority, TechStack})=>{

            console.log("");
            jobs.filter(job => {

                const flag = job.Location === Location && job.IOM === IOM && job.Seniority === Seniority && job.TechStack === TechStack;

                if(flag){
                    const firstName = Talent_Name.split(' ')[1];
                    if(list[firstName]){
                        list[firstName].push(job);
                    }else{
                        list[firstName] = [job];
                    }
                }   
            });

        });

        //console.log(list);

        //keep [3,5] jobs
        console.log(Object.entries(list));
        const matchList = Object.entries(list).filter((person) => person[1].length >= 3 && person[1].length <= 5);
        console.log(matchList);
    }

    return(
        <>
            <button onClick={handleTalent}>Telents Import</button>
            <button onClick={handleJD}>JD Import</button>
            <button onClick={handleLoadData}>Load Data</button>
        </>
    )
}

export default Testxlsx;