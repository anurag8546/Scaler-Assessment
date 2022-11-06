import React, {useState, useEffect} from 'react';
import {Routes,Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import InterviewList from './components/InterviewList';
import { db } from "./config-firebase";
import {collection,doc, getDocs,deleteDoc, setDoc, query, where, limit, addDoc,getCountFromServer,updateDoc,deleteField} from "firebase/firestore"; 
import './App.css';

function App() {
  const [boxi, setBoxi] = useState(false);
  const [boxu, setBoxu] = useState(false);
  const [i, seti] = useState([]);
  const [interviewerList, setinterviewerList] = useState([]);
  const [intervieweeList, setintervieweeList] = useState([]);
  const [u, setu] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  // const [deleted, setDelete] = useState("");
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
    const  getUsers = async () =>{
      const userRef = collection(db, "users");
      const q =  query(userRef, where("type", "==", 0));
      const snapshot = await getDocs(q);
      setinterviewerList(snapshot.docs.map((doc)=>({...doc.data(), id:doc.id})));
      };
    getUsers();
  },[]);
  // useEffect(()=>{
  //   var coll = document.getElementsByClassName('delete');
  //   for(var jk=0; jk<coll.length; jk++){
  //     var id = coll[jk].target.parentElement.getAttribute('name');
  //     console.log(id);
  //     coll[jk].addEventListener("click",function(){setDelete(id)});
  //   }
  // },[]);
  useEffect(()=>{
    const  getUsersu = async () =>{
      const userRef = collection(db, "users");
      const q =  query(userRef, where("type", "==", 1));
      const snapshot = await getDocs(q);
      setintervieweeList(snapshot.docs.map((doc)=>({...doc.data(), id:doc.id})));
      };
    getUsersu();
  },[]);
  console.log(interviewerList);
  var interviewer = [];
  var interviewee = [];
  var interviewerListi = [];
  console.log(i);
  const addNameu = (e) =>{
    setu([...u, e.target.getAttribute('id')]);
    e.target.setAttribute("disabled",true);
    e.target.style.backgroundColor="#c1c1c1";
  }
  const addNamei = (e) =>{
    seti([...i, e.target.getAttribute('id')]);
    e.target.setAttribute("disabled",true);
    e.target.style.backgroundColor="#c1c1c1";

  }
  const reEnablei = (e) =>{
    const nameii=e.target.getAttribute('name');
    document.getElementById(nameii).removeAttribute('disabled');
    document.getElementById(nameii).style.backgroundColor="cyan";
    var z= i.splice(0,i.indexOf(nameii));
    var y = i.splice(i.indexOf(nameii)+1,i.length);
    console.log(z);
    console.log(y);
    var k = [...z,...y];
    seti(k);
    console.log(i);
  }
  const reEnableu = (e) =>{
    const nameii=e.target.getAttribute('name');
    document.getElementById(nameii).removeAttribute('disabled');
    document.getElementById(nameii).style.backgroundColor="cyan";
    var z= u.splice(0,u.indexOf(nameii));
    var y = u.splice(u.indexOf(nameii)+1,u.length);
    console.log(z);
    console.log(y);
    var k = [...z,...y];
    setu(k);
    console.log(u);
  }
  const submit = () =>{
    var news = startTime;
    news= news[0]+news[1]+news[3]+news[4];
    console.log(news);
    var newe = endTime;
    newe= newe[0]+newe[1]+newe[3]+newe[4];
    console.log(newe);
    if(i.length<=0 || u.length<=0 || !startTime || !endTime){
      setError('* Kindly fill all details');
    }else{
      setError("");
    }
    var f =0;
    //check for occupied slot
      const  getStatus = async () =>{
      const userRefu = collection(db, "viewStatus");
      let itime = [];
      let utime = [];
      const zsd = [...i,...u];
      console.log("dd");
      console.log(zsd);
      const q =  query(userRefu,where("email" ,"in", [...zsd]));
      const snapshot = await getDocs(q);
      snapshot.docs.forEach((doc)=>{
        itime.push({...doc.data(), id:doc.id})
      })
      // setSi(snapshot.docs.map((doc)=>({...doc.data(), id:doc.id})));
      console.log(itime);
      for(var p=0; p<itime.length; p++){
        // console.log(news+ "+as"+ newe);
        var ts = parseInt(news);
        var te = parseInt(newe);
        console.log(ts+"@"+te);
        if(( (ts<itime[p].startTime) && (te < itime[p].startTime)) || ((ts >itime[p].endTime) && (te > itime[p].endTime)) ){
        continue;
        // console.log(itime[p].email+" not busy");
        }else{
          f=1;
          console.log(itime[p].email+" busy");
          setError(itime[p].email + " is busy at this time slot");
          break;
        }
      }

      };
    getStatus();

    //if all members are free
    const  addInterview = async () =>{
      const userRef = collection(db, "Interview");
     const adding = await addDoc(userRef, {
        Interviewee: u,
        Interviewer: i,
        startTime: startTime,
        endTime:endTime
      });
      const id= adding.id;
      console.log(id);
      const userRefs = collection(db, "viewStatus");
      for(var l=0; l<i.length; l++){
      await addDoc(userRefs, {
        email: i[l],
        interviewId: id,
        startTime: news,
        endTime:newe
      });
    }
    for(var m=0; m<u.length; m++){
      await addDoc(userRefs, {
        email: u[m],
        interviewId: id,
        startTime: news,
        endTime:newe
      });
    }
      };
      if(f===0){
        addInterview();
        setBoxi(false);
        setBoxu(false);
        seti([]);
        setu([]);
        setEndTime("");
        setStartTime("");
        setintervieweeList([]);
        setinterviewerList([]);
      }
    // addInterview();
    
  }
  
  // getUsers();


  return (
    <>
    <Navbar/>
    <div className='main'>
      <div className='left'>
        <div className='box'>
        <h2>Schedule an interview</h2>
        <div className='error'>{error}</div>
          <div className='card'>
            <div className='i-names names'>
              {i.map((content, i)=><button key={i}>{content} <i name={content} className='fa fa-times' onClick={reEnablei}></i></button>)}
            </div>
            <button className='o-btn' onClick={()=>{setBoxi(!boxi);setBoxu(false)}}>Select Interviewer</button><br/>
            <div className='u-names names'>
            {u.map((content, i)=><button key={i}>{content} <i name={content} className='fa fa-times'  onClick={reEnableu}></i></button>)}
            </div>
            <button className='o-btn' onClick={()=>{setBoxu(!boxu);setBoxi(false);}}>Select Interviewee</button><br/>
            <span>Start Time</span><br/>
            <input type="time" onFocus = {()=>{setBoxi(false);setBoxu(false)}} onChange={(e)=>setStartTime(e.target.value)} value={startTime}/>
            <br/>
            <span>End Time</span><br/>
            <input type="time" onFocus = {()=>{setBoxi(false);setBoxu(false)}}  onChange={(e)=>setEndTime(e.target.value)} value={endTime}/>
            <div className='create' onClick={submit}>Schedule Interview</div>
          </div>
        </div>
      </div>
      <div className='right'>
      <div className='header'>Interview List</div>
        <div className='user-table'>
        <table>
            <tr>
                <th>S.No</th>
                <th>Interviewer</th>
                <th>Interviewee</th>
                <th>Start Time</th>
                <th>End Time</th>
                {/* <th>Operation</th> */}
            </tr>
            {
              si.map((d,e)=>
                <tr key={e}>
                  <td>{e+1}</td>
                  <td className='flex-row'>{d.Interviewer.map((w,r)=><>● {w} <br/> </>)}</td>
                  <td className='flex-row'>{d.Interviewee.map((w,r)=><>● {w} <br/> </>)}</td>
                  <td>{d.startTime}</td>
                  <td>{d.endTime}</td>
                  {/* <td><button className='delete'
                  onClick={async (e)=>{
                    var hj = e.target.parentElement.getAttribute('name');
                    console.log(hj);
                    const ref = doc(db, "Interview",hj);
                    await deleteDoc(ref);
                    const refd = doc(db, "viewStatus");
                    const q = query(refd, where("interviewId", "==", hj));
                    
                    window.location.reload();
                  }}
                   name={d.id}><i className='fa fa-trash'></i></button></td> */}
                </tr>
              )
            }
        </table>
        </div>
      </div>
    </div>
    {
      boxi &&
      <div>
        <div className='user-table ibox toggle'>
        <div className='toggle-head'>Select interviewer <span onClick={()=>setBoxi(false)}><i className='fa fa-times'></i></span></div>
        <table>
            <tr>
                <th>S.No</th>
                <th>Email</th>
                <th>Add</th>
            </tr>
            {
              interviewerList.map((d,e)=>
                <tr>
                  <td>{e+1}</td>
                  <td>{d.email}</td>
                  <td><button id={d.email} onClick={addNamei}>Add</button></td>
                </tr>
              )
            }
        </table>
        </div>
      </div>
    }
    {
      boxu &&
      <div>
        <div className='user-table ubox toggle'>
      <div className='toggle-head'>Select interviewee <span onClick={()=>setBoxu(false)}><i className='fa fa-times'></i></span></div>
        <table>
            <tr>
                <th>S.No</th>
                <th>Email</th>
                <th>Add</th>
            </tr>
            {
              intervieweeList.map((d,e)=>
                <tr>
                  <td>{e+1}</td>
                  <td>{d.email}</td>
                  <td><button id={d.email} onClick={addNameu}>Add</button></td>
                </tr>
              )
            }
        </table>
        </div>
      </div>
    }
    </>
  );
}

export default App;
