import "./dailyweekly.css";
import { useEffect, useState } from "react";

const DailyWeeklyMost = () => {
  const [btn, setBtn] = useState("daily");
  const [dailyWebsites, setDailyWebsites] = useState([]);
  const [weeklyWebsites, setWeeklyWebsites] = useState({});
  const day = new Date().getDay().toString();

  const handleButtonClick = (btn) => {
    setBtn(btn);
  };

  const parseWebsitesDaily = async () => {
    let newDailyWebsites = [...dailyWebsites];
    const dailyWebsitesPromise = await chrome.storage.local.get(day);
    const dailyWebsitesStringify = JSON.stringify(dailyWebsitesPromise[day]);
    const dailyWebsitesParse = JSON.parse(dailyWebsitesStringify);
    for (const [key, value] of Object.entries(dailyWebsitesParse)) {
      const exists = newDailyWebsites.some((site) => site.key === key);
      if (!exists) {
        newDailyWebsites.push({ key, value });
      }
    }
    setDailyWebsites(newDailyWebsites);
  };

  const parseWebsitesWeekly = async () => {
    let newWeeklyWebsites = { ...weeklyWebsites };
    for (let i = 0; i <= parseInt(day); i++) {
      const weeklyWebsitesPromise = await chrome.storage.local.get(i.toString());
      const weeklyWebsitesStringify = JSON.stringify(weeklyWebsitesPromise[i.toString()]);
      const dailyWebsitesParse = JSON.parse(weeklyWebsitesStringify);
      for (const [key, value] of Object.entries(dailyWebsitesParse)) {
        if (newWeeklyWebsites.hasOwnProperty(key)) {
          newWeeklyWebsites[key] += value;
        } else {
          newWeeklyWebsites[key] = value;
        }
      }
    }
    setWeeklyWebsites(newWeeklyWebsites);
  };

  useEffect(() => {
    if (btn === "daily") {
      parseWebsitesDaily();
    }
  }, [btn]);

  useEffect(() => {
    parseWebsitesWeekly();
  }, []);

  const getFaviconUrl = (domain) => `https://www.google.com/s2/favicons?domain=${domain}`;

  return (
    <div>
      <section className="dailyWeeklyWrapper">
        <div className="dailyWeekly">
          <div
            onClick={() => handleButtonClick("daily")}
            className={btn === "daily" ? "dailyweeklyBtnActive" : "dailyweeklyBtn"}
          >
            Daily
          </div>

          <div
            onClick={() => handleButtonClick("weekly")}
            className={btn === "weekly" ? "dailyweeklyBtnActive" : "dailyweeklyBtn"}
          >
            Weekly
          </div>
        </div>
      </section>
      <div className="dataWrapper">
        {btn === "daily" ? (
          dailyWebsites.sort((a, b) => b.value - a.value).map((site, index) => (
            <div key={index} className="websiteData">
              <div className = 'websiteIcons'>
              <img src={getFaviconUrl(site.key)} alt={`${site.key} favicon`} className='icons'/>
              {site.key}
              </div>
              <div>
                {`${Math.floor(site.value / 3600)}`.padStart(2, "0")}h{" "}
                {`${Math.floor(site.value / 60) % 60}`.padStart(2, "0")}m{" "}
                {`${site.value % 60}`.padStart(2, "0")}s
              </div>
            </div>
          ))
        ) : (
          Object.entries(weeklyWebsites)
            .sort(([, valueA], [, valueB]) => valueB - valueA)
            .map(([key, value], index) => (
              <div key={index} className="websiteData">
                <div className="websiteIcons">
                <img src={getFaviconUrl(key)} alt={`${key} favicon`} className="icons"/>
                {key}
                </div>
                <div>
                  <div>
                    {`${Math.floor(value / 3600)}`.padStart(2, "0")}h{" "}
                    {`${Math.floor(value / 60) % 60}`.padStart(2, "0")}m{" "}
                    {`${value % 60}`.padStart(2, "0")}s
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default DailyWeeklyMost;
