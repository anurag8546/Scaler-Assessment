import React, {useState, useEffect} from 'react';
import { db } from "../config-firebase";
import {collection, getDocs,setDoc, deleteDoc, query, where, limit, addDoc,getCountFromServer} from "firebase/firestore"; 

const InterviewList = () => {
    const [si, setSi] =useState([]);
    const[dele, setDelete] = useState("");
    useEffect(()=>{
        const  getInterview = async () =>{
          const userRef = collection(db, "Interview");
          const q =  query(userRef);
          const snapshot = await getDocs(q);
          setSi(snapshot.docs.map((doc)=>({...doc.data(), id:doc.id})));
          };
        getInterview();
      },[]);
      useEffect(()=>{
        const userRefd = collection(db, "Interview", dele);
         deleteDoc(userRefd);
          console.log(dele);
      },[dele]);
  return (
    <>
        <div className='header'>Interview List</div>
        <div className='user-table'>
        <table>
            <tr>
                <th>S.No</th>
                <th>Interviewer</th>
                <th>Interviewee</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Operation</th>
            </tr>
            {
              si.map((d,e)=>
                <tr key={e}>
                  <td>{e+1}</td>
                  <td className='flex-row'>{d.Interviewer.map((w,r)=><span key={r}>{w}</span>)}</td>
                  <td className='flex-row'>{d.Interviewee.map((w,r)=><span key={r}>{w}</span>)}</td>
                  <td>{d.startTime}</td>
                  <td>{d.endTime}</td>
                  <td><button className='delete' onClick={(e)=>setDelete(e.target.getAttribute('name'))} name={d.id}>{d.id}<i className='fa fa-trash'></i></button></td>
                </tr>
              )
            }
        </table>
        </div>
    </>
  )
}

export default InterviewList;