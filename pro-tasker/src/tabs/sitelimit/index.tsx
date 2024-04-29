import React, {useEffect, useState} from "react"

import {
  addBlocked,
  editBlocked,
  removeBlocked,
  retrieveBlocked,

} from "../../api/blockedDB"

import "./site_styles.css"

export{}


const SiteLimit = () => {
  const [addVisibility, setAddVisibility] = useState(false)
  const [editVisibility, setEditVisibility] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null);
  const [showInputs, setShowInputs] = useState(false);
  const [day, setDay] = useState('Monday');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [time, setTime] = useState('');
  const [suffix, setSuffix] = useState('AM');
  const [schedules, setSchedules] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [site, setSite] = useState('');
  const [timerHour, setTimerHour] = useState('');
  const [timerMinute, setTimerMinute] = useState('');
  const [addSiteName, setAddSiteName] = useState("");
  const [siteList, setWebsiteList] = useState({});
  const [selectedSite, setSelectedSite] = useState('');

  const handleClick = () => {
    setShowInputs(!showInputs);
  }

  const handleSaveSchedule = () => {
    const id = new Date().getTime();
    const time = `${hour}:${minute}`;
    setSchedules([...schedules, { id, day, time, suffix }]);
    setDay('Monday');
    setHour('');
    setMinute('');
    setSuffix('AM');
    setShowInputs(false);
  };
  
  async function addWebsite() { 
    await addBlocked(addSiteName, parseInt(timerHour), parseInt(timerMinute), schedules);
    setTimerHour("")
    setTimerMinute("")  
    setAddVisibility(false);
  }

  // This function is called when the user decides they want to save the
  // combination of inputs they have put.
  function handleSave() {
    const id = new Date().getTime();
    const timer = `${timerHour}:${timerMinute}`;
    if (editingIndex !== null) {
      // Update the item at editingIndex
      setWebsites(websites.map((website, index) => index === editingIndex ? {...website, url: site, timer, schedules} : website));
      setEditingIndex(null); // Reset editingIndex
    } else {
      // Add a new item
      setWebsites([...websites, {id, url: site, timer, schedules}]);
    }
    
    setSite('');
    setTimerHour('');
    setTimerMinute('');
    setSchedules([]);
    setAddVisibility(false);
    addWebsite();
  }

  const addSiteClick = () => {
    // Reset other input fields
    setSite('');
    setTimerHour('');
    setTimerMinute('');
    setSuffix('AM');
    // Reset schedules to an empty array
    setSchedules([]);
    setAddVisibility(true);
    setShowInputs(false);
  };
  

  const handleEditSite = async () => {  
    // Call editBlocked function with the edited values and the selected site
    await editBlocked(selectedSite, parseInt(timerHour), parseInt(timerMinute), schedules);
    
    // Reset input fields and close the edit popup window
    setTimerHour("");
    setTimerMinute("");
    setEditVisibility(false);
  };
  
  
const parseWebsiteList = async () => {
  try {
    const retrieveData = await chrome.storage.local.get();
    const newSiteList = {};

    for (const site in retrieveData) {
      if (site.startsWith("blocked-")) {
        const siteName = site.substring(8);
        newSiteList[siteName] = retrieveData[site];
      }
    }

    setWebsiteList(newSiteList);
  } catch (error) {
    console.error("Error parsing website list:", error);
  }
};

useEffect(() => {
  parseWebsiteList(); // Initial fetch

  const loadWebsitesInterval = setInterval(parseWebsiteList, 1000);

  return () => {
    clearInterval(loadWebsitesInterval);
  };
}, []);


  // Rest of your component code...
  // Render website data in your log body


  return (
    <section>
	    <div className="addSite" onClick={addSiteClick}>
        + Add Site
      	</div>
        <div className="siteLog">
        <div className="siteLogHeader">
          <h4>Websites</h4>
          <h4>Set Time Limit</h4>
          <h4>Schedule</h4>
        </div>
        <div id="logBody">
            {Object.keys(siteList).map((site, index) => (
      <div key={index}>
        <div className="websiteText">{site}</div>
        {/* Accessing the properties using dot notation */}
        <div className="timerText">{siteList[site].hours} : {siteList[site].minutes}</div>
        <button className="activateButton" onClick={handleSave}>Activate</button>
        <div className="scheduleText">
          {siteList[site].schedules.length > 0 ? (
            siteList[site].schedules.map((schedule, index) => (
              <div key={index}>
                <span>{schedule.day}</span>
                <span>{' '}{schedule.time} {schedule.suffix}</span>
              </div>
            ))
            ) : (
              <div>None</div>
            )}
            </div>
            <button className="editButton" onClick={() => {setEditVisibility(true), setEditingIndex(index)}}>E</button>
          </div>
        ))}
      </div>
      </div>
{addVisibility && (
        <div id="sitePopup" className="sitePopup">
          <div className="sitePopupHeader">
            <h3 className="titleLabel">Add Website</h3>
            <div className="closeBox" onClick={() => setAddVisibility(false)}>
              X
            </div>
          </div>
          <div>
            <h3>Website URL:</h3>
            <input id="site" className="site_input" type="text" onChange={(e) => setAddSiteName(e.target.value)} placeholder="https://www.example.com/"></input>
            <h3>Website Timer:</h3>
            <div className="time_input">
              <input id="hour" className="time" type="text" value={timerHour} onChange={(e) => setTimerHour(e.target.value)} placeholder="Hours"></input>
              <input id="minute" className="time" type="text" value={timerMinute} onChange={(e) => setTimerMinute(e.target.value)} placeholder="Minutes"></input>
              <input className="time" type="submit" value="Save" onClick={() => addWebsite()}></input>
            </div>
            <div className="schedule">
            <div className="addScheduleButton" onClick={handleClick}>+</div>
            <div className="scheduleLabel">Schedule:</div>
          </div>
          <div className="scheduleTable">
          <div className="scheduleHeader">
            <h4>Day</h4>
            <h4>Start Time</h4>
          </div>
          {showInputs && (
            <div>
              <select className="dayInputField" value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>        
              </select>
              <input className="timeInputField" value={hour} onChange={(e) => setHour(e.target.value)} placeholder="H" />
              <input className="timeInputField" value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="M" />
              <select className="scheduleInputField" value={suffix} onChange={(e) => setSuffix(e.target.value)}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
              <button onClick={handleSaveSchedule}>Save</button>
            </div>
          )}
          {schedules.map((schedule) => (
          <div key={schedule.id} className="scheduleItem">
            <span className="scheduleDay">{schedule.day}</span>
            <span className="scheduleTime">{schedule.time} {schedule.suffix}</span>
          </div>
        ))}
        </div>
          </div>
          </div>
      )}
      {editVisibility && (
        <div id="sitePopup" className="sitePopup">
          <div className="sitePopupHeader">
            <h3 className="titleLabel">Edit Website</h3>
            <div className="closeBox" onClick={() => setEditVisibility(false)}>
              X
            </div>
          </div>
          <div>
            <h3>Website URL:</h3>
                        <select className="comboBox" value={selectedSite} onChange={(e) => setSelectedSite(e.target.value)}>
              {Object.keys(siteList).map((site, index) => (
                <option key={index} value={site}>{site}</option>
              ))}
            </select>

            <h3>Website Timer:</h3>
            <div className="time_input">
              <input id="hour" className="time" type="text" value={timerHour} onChange={(e) => setTimerHour(e.target.value)} placeholder={'${siteData.hours}'}></input>
              <input id="minute" className="time" type="text" value={timerMinute} onChange={(e) => setTimerMinute(e.target.value)} placeholder={'${siteData.minutes}'}></input>
              <input className="time" type="submit" value="Save" onClick={handleEditSite}></input>
            </div>
            <div className="schedule">
            <div className="addScheduleButton" onClick={handleClick}>+</div>
            <div className="scheduleLabel">Schedule:</div>
          </div>
          <div className="scheduleTable">
          <div className="scheduleHeader">
            <h4>Day</h4>
            <h4>Start Time</h4>
          </div>
          {showInputs && (
            <div>
              <select className="dayInputField" value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>        
              </select>
              <input className="timeInputField" value={hour} onChange={(e) => setHour(e.target.value)} placeholder="H" />
              <input className="timeInputField" value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="M" />
              <select className="scheduleInputField" value={suffix} onChange={(e) => setSuffix(e.target.value)}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
              <button onClick={handleSaveSchedule}>Save</button>
            </div>
          )}
          {schedules.map((schedule) => (
          <div key={schedule.id} className="scheduleItem">
            <span className="scheduleDay">{schedule.day}</span>
            <span className="scheduleTime">{schedule.time} {schedule.suffix}</span>
          </div>
        ))}
        </div>
          </div>
          </div>
      )}
    </section>
  )
}

export default SiteLimit
