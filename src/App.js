import styled from "styled-components";
import { app, db } from "./firebase";
import {useState, useEffect, useRef} from "react"
import { set, ref, onValue, remove, update } from "firebase/database";
import { GoogleAuthProvider, signInWithRedirect, getAuth, signOut, signInWithPopup } from "firebase/auth";
import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import DeleteIcon from '@mui/icons-material/Delete';
import axiosRetry from 'axios-retry';
import axios from "axios";

import clouds from "./images/clouds.png"
import day from "./images/day.png"
import lightning from "./images/lightning.png"
import moon from "./images/moon.png"
import morning from "./images/morning.png"
import night from "./images/night.png"
import snow from "./images/snow.png"
import sunny from "./images/sunny.png"
import rain from "./images/rain.png"

const google = window.google;

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  }
});

const locationFullName = [{"Abbr":"A&AB","Full":"Art & Architecture Building"},{"Abbr":"AH","Full":"Angell Hall"},{"Abbr":"AL","Full":"Walter E. Lay Automotive Lab"},{"Abbr":"ALH","Full":"Alice Lloyd Hall"},{"Abbr":"ARGUS2","Full":"Argus Building II, Television Center, 408 S. Fourth Street"},{"Abbr":"ARGUS3","Full":"Argus Building III, 416 S. Fourth Street"},{"Abbr":"ARR","Full":"Location to be Arranged"},{"Abbr":"BAM HALL","Full":"Blanch Anderson Moore Hall, School of Music"},{"Abbr":"BELL POOL","Full":"Margaret Bell Pool, Central Campus Recreation Building"},{"Abbr":"BEYSTER","Full":"Bob and Betty Beyster Building (formerly CSE)"},{"Abbr":"BIOL STAT","Full":"Biological Station"},{"Abbr":"BLAU","Full":"Jeff T Blau Hall"},{"Abbr":"BMT","Full":"Burton Memorial Tower"},{"Abbr":"BOT GARD","Full":"Matthaei Botanical Gardens, Dixboro Road"},{"Abbr":"BSB","Full":"Biological Science Building"},{"Abbr":"BSRB","Full":"Biomedical Science Research Building"},{"Abbr":"BURS","Full":"Bursley Hall"},{"Abbr":"BUS","Full":"Ross School of Business"},{"Abbr":"CAMP DAVIS","Full":"Camp Davis"},{"Abbr":"CCCB","Full":"Central Campus Classroom Bldg"},{"Abbr":"CCRB","Full":"Central Campus Recreation Building"},{"Abbr":"CHEM","Full":"Chemistry Building"},{"Abbr":"CHRYS","Full":"Chrysler Center"},{"Abbr":"COMM PARK","Full":"Commerce Park"},{"Abbr":"COOL","Full":"Cooley Building"},{"Abbr":"COUZENS","Full":"Couzens Hall"},{"Abbr":"CPH","Full":"Children's Psychiatric Hospital"},{"Abbr":"CRISLER","Full":"Crisler Center"},{"Abbr":"CCSB","Full":"Campus Safety Services Building, 1239 Kipke Dr."},{"Abbr":"CSRB","Full":"Climate and Space Research Building (formerly Space Research Building)"},{"Abbr":"DANA","Full":"Dana Building (School of Environment & Sustainability)"},{"Abbr":"DANCE","Full":"Dance Building"},{"Abbr":"DC","Full":"Duderstadt Center"},{"Abbr":"DENT","Full":"Dental Building"},{"Abbr":"DOW","Full":"Dow Engineering Building"},{"Abbr":"E-BUS","Full":"Executive Education"},{"Abbr":"EECS","Full":"Electrical Engineering and Computer Science Building"},{"Abbr":"EH","Full":"East Hall"},{"Abbr":"EQ","Full":"East Quadrangle"},{"Abbr":"ERB1","Full":"Engineering Research Building 1"},{"Abbr":"ERB2","Full":"Engineering Research Building 2"},{"Abbr":"EWRE","Full":"Environmental & Water Resources Engineering Building"},{"Abbr":"FA CAMP","Full":"Fresh Air Camp, Pinckney"},{"Abbr":"FMCRB","Full":"Ford Motor Company Robotics Building"},{"Abbr":"FORD LIB","Full":"Ford Library"},{"Abbr":"FXB","Full":"Francois-Xavier Bagnoud Building"},{"Abbr":"GFL","Full":"Gorguze Family Laboratory (formerly EPB)"},{"Abbr":"GGBL","Full":"G. G. Brown Laboratory"},{"Abbr":"GLIBN","Full":"Harlan Hatcher Graduate Library, North"},{"Abbr":"HH","Full":"Haven Hall"},{"Abbr":"HUTCH","Full":"Hutchins Hall"},{"Abbr":"IM POOL","Full":"Intramural Building"},{"Abbr":"IOE","Full":"Industrial and Operations Engineering Building"},{"Abbr":"ISR","Full":"Institute for Social Research"},{"Abbr":"JEFFRIES","Full":"Jeffries Hall, Law School"},{"Abbr":"K-BUS","Full":"Kresge Library"},{"Abbr":"KEC","Full":"Kellogg Eye Center"},{"Abbr":"KEENE THTR EQ","Full":"Keene Theater, Residential College, East Quadrangle"},{"Abbr":"KELSEY","Full":"Kelsey Museum of Archaeology"},{"Abbr":"KHRI","Full":"Kresge Hearing Research Institute"},{"Abbr":"LANE","Full":"Lane Hall"},{"Abbr":"LBME","Full":"Lurie Biomedical Engineering Building"},{"Abbr":"LEAG","Full":"Michigan League"},{"Abbr":"LEC","Full":"Lurie Engineering Center"},{"Abbr":"LLIB","Full":"Law Library"},{"Abbr":"LORCH","Full":"Lorch Hall"},{"Abbr":"LSA","Full":"Literature, Science, and the Arts Building"},{"Abbr":"LSI","Full":"Life Sciences Institute"},{"Abbr":"MARKLEY","Full":"Mary Markley Hall"},{"Abbr":"MAX KADE","Full":"Max Kade House, 627 Oxford Street"},{"Abbr":"MH","Full":"Mason Hall"},{"Abbr":"MHRI","Full":"Mental Health Research Institute"},{"Abbr":"MLB","Full":"Modern Languages Building"},{"Abbr":"MONREOCTY HD","Full":"Monroe County Health Department"},{"Abbr":"MOSHER","Full":"Mosher Jordan Hall"},{"Abbr":"MOTT","Full":"C. S. Mott Children's Hospital"},{"Abbr":"MSC1","Full":"Medical Science, Building I"},{"Abbr":"MSC2","Full":"Medical Science, Building II"},{"Abbr":"MSRB3","Full":"Medical Science Research, Building III"},{"Abbr":"NAME","Full":"Naval Architecture and Marine Engineering Building"},{"Abbr":"NCRB","Full":"North Campus Recreation Building"},{"Abbr":"NCRC","Full":"North Campus Research Complex"},{"Abbr":"NIB","Full":"300 North Ingalls Building"},{"Abbr":"400NI","Full":"400 North Ingalls Building"},{"Abbr":"426NI","Full":"426 North Ingalls Building"},{"Abbr":"NORTHVILLEPH","Full":"Northville State Hospital"},{"Abbr":"NQ","Full":"North Quad"},{"Abbr":"NUB","Full":"1100 North University Building"},{"Abbr":"NUCB","Full":"1310 North University Court Building"},{"Abbr":"PALM","Full":"Palmer Commons"},{"Abbr":"PHOENIXLAB","Full":"Phoenix Memorial Laboratory"},{"Abbr":"PIER","Full":"Pierpont Commons"},{"Abbr":"POWER CTR","Full":"Power Center for the Performing Arts"},{"Abbr":"RACK","Full":"Horace H. Rackham, School of Graduate Studies"},{"Abbr":"RAND","Full":"Randall Laboratory"},{"Abbr":"R-BUS","Full":"Ross School of Business Building"},{"Abbr":"REVELLI","Full":"William D. Revelli Hall"},{"Abbr":"ROSS AC","Full":"Stephen M. Ross Academic Center"},{"Abbr":"SCHEM","Full":"Glenn E. Schembechler Hall"},{"Abbr":"SEB","Full":"School of Education Building"},{"Abbr":"SHAPIRO","Full":"Shapiro Undergraduate Library"},{"Abbr":"SKB","Full":"School of Kinesiology Building (formerly the Kraus Building)"},{"Abbr":"SM","Full":"Earl V. Moore Building, School of Music"},{"Abbr":"SPH1","Full":"Henry Vaughan Building, School of Public Health I"},{"Abbr":"SPH2","Full":"Thomas Francis, Jr Building, School of Public Health II"},{"Abbr":"SSWB","Full":"School of Social Work Building"},{"Abbr":"STAMPS","Full":"Stamps Auditorium"},{"Abbr":"STB","Full":"202 South Thayer Building"},{"Abbr":"STJOSEPH HOSP","Full":"St. Joseph Mercy Hospital"},{"Abbr":"STOCKWELL","Full":"Stockwell Hall"},{"Abbr":"STRNS","Full":"Sterns Building"},{"Abbr":"T&TB","Full":"Track & Tennis Building"},{"Abbr":"TAP","Full":"Tappan Hall"},{"Abbr":"THSL","Full":"Taubman Health Science Library"},{"Abbr":"TISCH","Full":"Tisch Hall"},{"Abbr":"TMC","Full":"Trotter Multicultural Center, 428 S. State St"},{"Abbr":"UM HOSP","Full":"University Hospital"},{"Abbr":"UMMA","Full":"University of Michigan Museum of Art (Alumni Memorial Hall)"},{"Abbr":"UNION","Full":"Michigan Union"},{"Abbr":"USB","Full":"Undergraduate Science Building"},{"Abbr":"UTOWER","Full":"University Towers, 1225 S. University"},{"Abbr":"VETERANSHOSP","Full":"Veterans Administration Hospital"},{"Abbr":"WASHCTY HD","Full":"Washtenaw County Health Department"},{"Abbr":"W-BUS","Full":"Wyly Hall"},{"Abbr":"WDC","Full":"Charles R. Walgreen, Jr. Drama Center"},{"Abbr":"WEILL","Full":"Joan and Sanford Weill Hall"},{"Abbr":"WEIS","Full":"Weiser Hall"},{"Abbr":"WH","Full":"West Hall"},{"Abbr":"WOMEN'S HOSP","Full":"Women's Hospital"},{"Abbr":"WQ","Full":"West Quad"}]

const SectionContainer = styled.div`
  height:100vh;
  width: 100vw;
  display:flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`

const SearchContainer = styled.div`
  position: relative;
  margin-right:1%;
  flex-grow:1;
`

const ButtonContainer = styled.div`
  flex-grow:.3;
`

const Row = styled.div`
  width: 90%;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const VerticalContainer = styled.div`
  width: 32%;
  height: 70vh;
  border-radius:20px;
  border: solid 1px gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: auto;
`

const ClassContainer = styled.div`
  width:90%;
  height:fit-content;
  background-color:lavender;
  border-radius:20px;
  padding:2%;
  margin-top:2vh;
`

const WeatherContainer = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  height:55%;
`

const WeatherImageContainer = styled.div`
  height:100%;
  position: relative;
  display:flex;
  align-items: center;
  justify-content: center;
`

const WeatherBackgroundImage = styled.img`
  height:100%;
  position: relative;
`

const WeatherForegroundImage = styled.img`
  width:100%;
  position: absolute;
  left: center;
  top: center;
`

const ContentContainer = styled.div`
  height: ${props => (props.height)};
  width: 99%;
  border-radius:20px;
  border: solid 1px gray;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap:wrap;
`

const TextContainer = styled.div`
  width: 60%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-left:10%;
`
const NewLine = styled.div`
  width: 100%;
  height: ${props => props.height};
`

const AddTodoContainer = styled.div`
  width:80%;
  height:fit-content;
  background-color: lavender;
  border-radius:20px;
  padding:5%;
  margin:2vh;
`

function App() {

  const [courses,setCourses] = useState([]);
  const [subjectSelect, setSubjectSelect] = useState("");
  const [courseNbrSelect, setCourseNbrSelect] = useState("");
  const [sectionSelect, setSectionSelect] = useState("");
  const [addedClasses, setAddedClasses] = useState([]);
  const [duration, setDuration] = useState(false)
  const [weather, setWeather] = useState(null);
  const [user, setUser] = useState({});
  const [todoName, setTodoName] = useState("");
  const [todoDate, setTodoDate] = useState(new Date());
  const [todo, setTodo] = useState([]);

  const uniqueSubjects = [...new Set(courses.map(item => item.Subject))];

  const subjectFilteredData = courses.filter(function (i,n){
    return i.Subject.toLowerCase() === (subjectSelect !== null ? subjectSelect.toLowerCase():"");
  });
  const courseNbrFilteredData = subjectFilteredData.filter(function (i,n){
    return i["Catalog Nbr"].toString() === (courseNbrSelect !== null ? courseNbrSelect.split(" ")[0].toLowerCase():"");
  })

  const uniqueCourseNbr = [...new Set(subjectFilteredData.map(item => item["Catalog Nbr"].toString()+ " (" + item["Course Title"]+")"))];
  const uniqueSections = [...new Set(courseNbrFilteredData.map(item => item.Section.toString()))]


  useEffect(()=>{
    onValue(ref(db,"classes"),(snapshot)=>{
      const data = snapshot.val();
      setCourses(data)
    })
  },[])

  function handleAddClass (){
    const classesToAdd = courseNbrFilteredData.filter(function (i,n){
      return parseInt(i.Section) === (courseNbrSelect !== null ? parseInt(sectionSelect.toLowerCase()):"");
    })


    const contains = addedClasses.some(elem =>{
      return JSON.stringify(classesToAdd[0]["Class Nbr"]) === JSON.stringify(elem["Class Nbr"]);
    });

    if (!contains){
      setAddedClasses((addedClasses) => [...addedClasses, ...classesToAdd])
      setCourseNbrSelect("");
      setSectionSelect("");
      setSubjectSelect("");
      setDuration(true);
    }
    else{
      alert("Class Already Added");
    }
  }

  useEffect(()=>{
    if(!objectIsEmpty(user)){
      const dbRef = ref(db, 'users/'+ user.uid)
      update(dbRef, {addedClasses: addedClasses}).then(() => {
      }).catch((e) => {
        console.log(e);
      })
    }
  },[addedClasses])

  useEffect(()=>{
    if(!objectIsEmpty(user)){
      const dbRef = ref(db, 'users/'+ user.uid)
      update(dbRef, {todo: todo}).then(() => {
      }).catch((e) => {
        console.log(e);
      })
    }
  },[todo])

  function courseObjectToDateArray(object){
    if(object.Time === "ARR"){
      return;
    }

    const timeString = object.Time.substr(0, object.Time.indexOf('-'))
    var timeNum = parseInt(timeString)
    if (timeString.length === 1 || timeString.length === 2){
      if (object.Time.includes("AM"))
        timeNum = timeNum/24
      else{
        timeNum = (timeNum+12)/24;
      }
    }
    else if (timeString.length === 3 || timeString.length === 4){
        
      timeNum = (timeNum-timeNum%100)/(24*100)+(timeNum%100)/1440
      if(object.Time.includes("PM") && timeNum <.5){
        timeNum = timeNum+.5;
      }
    }
    else{
      console.log("this isn't supposed to happen")
    }
    const d = new Date();
    const timeTarget = d.getHours()/24 + d.getDay() + d.getMinutes()/3600-1
    var testTimeArray = []

    if(object.M !== ""){
      testTimeArray.push(timeNum)
    }
    if(object.T !== ""){
      testTimeArray.push(timeNum+1)
    }
    if(object.W !== ""){
      testTimeArray.push(timeNum+2)
    }
    if(object.TH !== ""){
      testTimeArray.push(timeNum+3)
    }
    if(object.F !== ""){
      testTimeArray.push(timeNum+4)
    }
    if(object.S !== ""){
      testTimeArray.push(timeNum+5)
    }
    if(object.SU !== ""){
      testTimeArray.push(timeNum+6)
    }
    
    if (testTimeArray.length === 0){
      console.log("No dates?")
      return;
    }
    else{
      testTimeArray.sort(
        function(a, b) {
          var distancea = Math.abs(timeTarget - a);
          var distanceb = Math.abs(timeTarget - b)
          return distancea - distanceb
        })
      }
      const testTimeArrayFiltered = testTimeArray.filter(function(d){
        return d - timeTarget > 0;
      })
      

      if (testTimeArrayFiltered.length === 0){
        return testTimeArray[testTimeArray.length-1]
      }
      else{
        return testTimeArrayFiltered[0];
      }
  }
  
  function getFullName(i){
    var n = addedClasses[i].Location.split(" ");
    n = n[n.length-1];
    var fullName = locationFullName.find(function(item,i){
      if(item.Abbr === n){
        return item
      }
    })
    fullName = (fullName.Full + " Ann Arbor Michigan");
    return fullName;
  }

  async function getLonLat(fullName){
    const options = {
      method: "get",
      url: 'http://localhost:8000/location',
      params: {fullName: fullName}
    }    
    return new Promise(resolve =>  axios.request(options).then((response)=>{
        resolve(response.data)
      }).catch((error)=>{
        console.log(error)
      })
    )
  }

  async function getLocation(){
    return new Promise(resolve => navigator.geolocation.getCurrentPosition(function(position){
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      resolve({lat: lat, lng: long});
    }))
  }

  async function getDurationWalking(i, destination, origin){

    const options = {
      method: "get",
      url: 'http://localhost:8000/walking',
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: destination.split(' ').join('+')
      }
    }
    return new Promise(resolve =>  axios.request(options).then((response)=>{
        var toUpdate = [... addedClasses]
        toUpdate[i].transitName = []
        toUpdate[i].duration = response.data.routes[0].legs[0].duration.text
        toUpdate[i].nextClass = courseObjectToDateArray(addedClasses[i])
        resolve(toUpdate);
      }).catch((error)=>{
        console.log(error)
      })
    )

    /*const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING
    };
    return new Promise(resolve => directionsService.route(request,
      function(result, status){
        if (status === google.maps.DirectionsStatus.OK){
          var toUpdate = [... addedClasses]
          toUpdate[i].transitName = []
          toUpdate[i].duration = result.routes[0].legs[0].duration.text
          toUpdate[i].nextClass = courseObjectToDateArray(addedClasses[i])
          //setAddedClasses(toUpdate)
          resolve(toUpdate);
        }
        else{
        }
      }
    ));*/
  }

  async function getDurationTransit(i, destination, origin){

    const options = {
      method: "get",
      url: 'http://localhost:8000/transit',
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: destination.split(' ').join('+')
      }
    }

    return new Promise(resolve =>  axios.request(options).then((response)=>{
        var toUpdate = [... addedClasses]
          toUpdate[i].transitName = []
          for (var j = 0; j < response.data.routes[0].legs[0].steps.length; j++){
            if ("transit_details" in response.data.routes[0].legs[0].steps[j]){
              toUpdate[i].transitName.push(response.data.routes[0].legs[0].steps[j].transit_details.line.name)
            }
          }
          toUpdate[i].nextClass = courseObjectToDateArray(addedClasses[i])
          toUpdate[i].duration = response.data.routes[0].legs[0].duration.text
          resolve(toUpdate);
      }).catch((error)=>{
        console.log(error)
      })
    )

    /*const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.TRANSIT
    };
    return new Promise(resolve => directionsService.route(request,
      function(result, status){
        if (status === google.maps.DirectionsStatus.OK){
          var toUpdate = [... addedClasses]
          toUpdate[i].transitName = []
          for (var j = 0; j < result.routes[0].legs[0].steps.length; j++){
            if ("transit" in result.routes[0].legs[0].steps[j]){
              toUpdate[i].transitName.push(result.routes[0].legs[0].steps[j].transit.line.name)
            }
          }
          toUpdate[i].nextClass = courseObjectToDateArray(addedClasses[i])
          toUpdate[i].duration = result.routes[0].legs[0].duration.text
          //setAddedClasses(toUpdate)
          resolve(toUpdate);
        }
        else{
        }
      }
    ));*/
  }


  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function fetchData(i){

    if (addedClasses.length === 0){
      console.log("No Classes")
      return;
    }
    const fullName = getFullName(i);
    const origin = await getLocation();
    const toUpdateWalking = await getDurationWalking(i, fullName, origin);
    const toUpdateTransit = await getDurationTransit(i, fullName, origin);
    await timeout(5000);
    if (toUpdateTransit[i].duration < toUpdateWalking[i].duration){
      setAddedClasses(toUpdateTransit)
    }
    else{
      setAddedClasses(toUpdateWalking);
    }
  }

  useEffect(()=>{
    if (duration){
      for(var i = 0; i < addedClasses.length; i++){ 
        fetchData(i);
      }
      setDuration(false);
    }
  },[duration])


  useEffect(()=>{
    const options = {
      method: "get",
      url: 'http://localhost:8000/weather'
    }

    axios.request(options).then((response)=>{
      setWeather(response.data)
    }).catch((error)=>{
      console.log(error)
    })
  },[])

  function numberToDay(num){
    const d = new Date();
    const day = d.getDay() -1;
    if (num === day){
      return "Today"
    }else if(num===0){
      return "Monday"
    }else if(num === 1){
      return "Tuesday"
    }else if(num === 2){
      return "Wednesday"
    }else if(num === 3){
      return "Thursday"
    }else if(num === 4){
      return "Friday"
    }else if(num === 5){
      return "Saturday"
    }else if(num === 6){
      return "Sunday"
    }
  }

  function handleWeatherBackground (){
    const d = new Date();
    const hour = d.getHours();
    if (hour < 9 && hour >= 6){
      return morning;
    }
    else if (hour >= 9 && hour <= 20){
      return day
    }
    else{
      return night
    }
  }

  function handleWeatherForeground(){

    if (weather === null){
      return;
    }
    else if (weather.weather[0].main === "Clouds"){
      return clouds;
    }
    else if (weather.weather[0].main === "Snow"){
      return snow;
    }
    else if (weather.weather[0].main === "Rain"){
      return rain ;
    }
    else if (weather.weather[0].main === "Thunderstorm"){
      return lightning;
    }
    else if (weather.weather[0].main === "Sunny" || weather.weather[0].main === "Clear"){
      const d = new Date();
      const hour = d.getHours();
      if (hour > 20){
        return moon;
      }
      else{
        return sunny;
      }
    }
    else{
      return
    }
  }

  function handleLogin(){
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    signInWithPopup(auth, provider).then((result)=>{
      setUser(result.user);
      onValue(ref(db, "users"), (snapshot) => {
        const data = snapshot.val();
        var arrayData = Object.values(data)
        arrayData = arrayData.filter(object => object.username === result.user.uid)
        if (arrayData.length === 0){
          //console.log("new user")
          set(ref(db, 'users/'+ result.user.uid), {
            username: result.user.uid,
            email: result.user.email,
          });
        }
        else{
          //console.log("returning user")
          onValue(ref(db, 'users/' + result.user.uid), (snapshot) => {
            const data = snapshot.val();
            if (data.hasOwnProperty("addedClasses")){
              setAddedClasses(data.addedClasses)
            }
            if (data.hasOwnProperty("todo")){
              setTodo(data.todo)
            }
          });
          
          setDuration(true);
        }
      });
    }).catch((error)=>{
      console.log(error)
    });
  }

  function handleLogOut(){
    const auth = getAuth();
    signOut(auth).then(() => {
      setUser({})
      setAddedClasses([])
      setTodo([]);
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  function handleDeleteClass(classNbr){
    const toUpdate = [...addedClasses];
    setAddedClasses(toUpdate.filter(object => object["Class Nbr"]!==classNbr));
  }

  const handleTodoDateChange = (newValue) => {
    setTodoDate(newValue);
  };

  const handleTodoNameChange = (event) => {
    setTodoName(event.target.value);
  }

  function handleDeleteTodo(i){
    const toUpdate = [...todo]
    toUpdate.splice(i, 1)
    setTodo(toUpdate)
  }

  function handleTodoAdd(){
    if (todoName !== ""){
      var toAddDate;
      if (typeof todoDate._d === "undefined"){
        toAddDate = todoDate.toLocaleString('en-us', { dateStyle: "short", timeStyle:"short" })
      }
      else{
        toAddDate = todoDate._d.toLocaleString('en-us', { dateStyle: "short", timeStyle:"short" })
      }
      const toAdd = {
        name: todoName,
        dueDate: toAddDate
      }
      const toUpdate = [...todo]
      toUpdate.push(toAdd);
      setTodo(toUpdate);
      const d = new Date();
      setTodoDate(d);
      setTodoName("");
    }
    else{
      alert("Please enter task name")
    }
  }

  function objectIsEmpty(obj){
    return(obj // null and undefined check
    && Object.keys(obj).length === 0
    && Object.getPrototypeOf(obj) === Object.prototype)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <SectionContainer>
        <Row>
          <ButtonContainer style={{flexGrow:.1, display: objectIsEmpty(user) ? "block":"none"}}>
            <Button variant="contained"
            sx={{ width: "100%", height: "5vh" }}
            disabled = {!objectIsEmpty(user)}
            onClick = {()=>handleLogin()}
            >
                Log In
            </Button>
          </ButtonContainer>
          <ButtonContainer style={{flexGrow:.1, display: !objectIsEmpty(user) ? "block":"none"}}>
            <Button variant="contained"
            sx={{ width: "100%",  height: "5vh" }}
            disabled = {objectIsEmpty(user)}
            color="inherit"
            onClick = {()=>handleLogOut()}
            >
                Log Out
            </Button>
          </ButtonContainer>

          <img src = {user.photoURL} style={{height: "5vh", borderRadius: "100%"}}></img>
        </Row>
        <Row>
          <SearchContainer>
            <Autocomplete
              value={subjectSelect}
              id="subject-select"
              options={uniqueSubjects.sort()}
              isOptionEqualToValue={(option, value) => {
                if (value === "") {
                  return true;
                } else if (value === option) {
                  return true;
                }
              }}
              onChange={(e, selectedObject) => {
                    setSubjectSelect(selectedObject)
                    setCourseNbrSelect("")
                    setSectionSelect("")
              }}
              sx={{ width: "100%" }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Subject"
                  variant="outlined"
                  />
              )}
            />
          </SearchContainer>

          <SearchContainer>
            <Autocomplete
              selectOnFocus = {true}
              id="course-select"
              value={courseNbrSelect}
              options={uniqueCourseNbr}
              isOptionEqualToValue={(option, value) => {
                if (value === "") {
                  return true;
                } else if (value === option) {
                  return true;
                }
              }}
              onChange={(e, selectedObject) => {
                  setCourseNbrSelect(selectedObject)
                  setSectionSelect("")
              }}
              sx={{ width: "100%" }}
              renderInput={params => (
                <TextField
                  {...params}
                  label={subjectSelect === "" ? "Select a Subject First":"Course Number"}
                  variant="outlined"
                  />
              )}
              disabled = {subjectSelect === "" ? true:false}
            />
          </SearchContainer>

          <SearchContainer>
            <Autocomplete
              id="section-select"
              value={sectionSelect}
              options={uniqueSections}
              isOptionEqualToValue={(option, value) => {
                //nothing that is put in here will cause the warning to go away
                if (value === "") {
                  return true;
                } else if (value === option) {
                  return true;
                }
              }}
              onChange={(e, selectedObject) => {
                setSectionSelect(selectedObject)
              }}
              disabled = {subjectSelect === "" ? true:false}
              sx={{ width: "100%" }}
              renderInput={params => (
                <TextField
                  {...params}
                  label={subjectSelect === "" ? "Select a Subject First":"Section Number"}
                  variant="outlined"
                  />
              )}
            />
          </SearchContainer>
        
          <ButtonContainer >
            <Button variant="contained"
            sx={{ width: "100%" }}
            disabled = {sectionSelect === "" || sectionSelect === null}
            onClick = {()=>handleAddClass()}
            >
                Add Class
            </Button>
          </ButtonContainer>
        </Row>
        <Row>
          <VerticalContainer style={{justifyContent: "space-between", border: "none"}}>
            <ContentContainer height = "35%" style={{alignContent: "flex-start"}}>
              <h3>Ann Arbor Weather</h3> <NewLine/>
              <WeatherContainer>
                <WeatherImageContainer>
                  <WeatherBackgroundImage src = {handleWeatherBackground()}/>
                  <WeatherForegroundImage src = {handleWeatherForeground()}/>
                </WeatherImageContainer>
                <TextContainer>
                <h2 style ={{margin:0}}>{ weather !== null ? Math.round(weather.main.temp) : "" } &#xb0;F </h2> <NewLine/>
                <h3 style ={{textTransform: "capitalize", margin:0}}>{ weather !== null ? weather.weather[0].description:""  }</h3>
                </TextContainer>
                </WeatherContainer>
            </ContentContainer>
            <ContentContainer height = "60%" style = {{overflow: "auto", alignContent: "flex-start"}}>
                {todo.map((data,i)=>(
                  <ClassContainer>
                    <h3 style={{margin:0, marginLeft:"1%"}}>{data.name}
                      <span style={{float: "right", clear: "both"}}> <DeleteIcon fontSize="0" onClick ={()=>handleDeleteTodo  (i)} style= {{cursor:"pointer"}}/> </span>
                    </h3>
                    <p style={{margin:0, marginLeft:"1%"}}>Due: {data.dueDate}</p>
                    
                  </ClassContainer>
                ))}
                <AddTodoContainer>
                  <h3 style={{marginTop:0, marginLeft:"1%"}}>Add Task</h3>
                  <Stack spacing={3}>
                    <TextField
                      label = "Task Name"
                      size = "small"
                      value = {todoName}
                      onChange = {handleTodoNameChange}
                    >
                    </TextField>
                    <DatePicker
                      label="Due Date"
                      inputFormat="MM/DD/yyyy"
                      value = {todoDate}
                      onChange ={handleTodoDateChange}
                      renderInput={(params) => <TextField size = "small" {...params} />}
                    >
                    </DatePicker>
                    <TimePicker
                      label="Time Due"
                      value = {todoDate}
                      onChange ={handleTodoDateChange}
                      renderInput={(params) => <TextField size = "small" {...params} />}
                    />
                    <Button
                     variant="contained"
                     sx={{width:"20%"}}
                     onClick = {()=>handleTodoAdd()}
                    >
                      Add
                    </Button>
                  </Stack>
                </AddTodoContainer>
            </ContentContainer>
          </VerticalContainer>
          <VerticalContainer style={{width:"66%", backgroundColor: !addedClasses.length ? "lightgrey":"white", justifyContent: !addedClasses.length ? "center":"flex-start" }}>
            <h1 style={{color: "gray", display: !addedClasses.length ? "inline-block":"none"}}>Add Classes Above</h1>
            {addedClasses.map((data,i)=>(
              <ClassContainer style={{marginBottom: i + 1 === addedClasses.length ? "2vh":"0"}}>
                <div>
                  <h3 style={{margin:0, backgroundColor: ""}}>
                    {data.Subject.match(/\(([^)]+)\)/)[1]+" "+data["Catalog Nbr"]}
                    <span style={{fontWeight: 400, fontSize: "12pt", float: "right", clear: "both"}}> {" " + data.Location+" "+ data.Time} <DeleteIcon fontSize="0" onClick ={()=>handleDeleteClass(data["Class Nbr"])} style= {{cursor:"pointer"}}/> </span>
                  </h3>
                </div>
                <div>
                  <p style={{backgroundColor: "", margin:0}}>
                    Time to Get to Class: {data.duration} <br/>
                    Mode of Transportation: {"transitName" in data && data.transitName.length !== 0 ? data.transitName:"Walking"} <br/>
                    Next Class: {numberToDay(data.nextClass-data.nextClass%1)}<br/>
                  </p>
                </div>
              </ClassContainer>
            ))}
          </VerticalContainer>
        </Row>
      </SectionContainer>
    </LocalizationProvider>
  );
}

export default App;
