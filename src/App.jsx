/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react';
import axios from 'axios';
import EChartsRender from './components/EChartsRender';

function App() {
  const [data, setData] = useState([]);
  const [siteData, setSiteData] = useState([]);
  const [newData, setNewData] = useState({});
  const [filterData, setFilterData] = useState({});
  const [options, setOptions] = useState({});

  useEffect(() => {
    const fetch = () => {
      const api = '/api/v1/rest/datastore/301000000A-000082-049?limit=2000';
      axios.get(api).then((res) => {
        if (res.status === 200) {
          const temp = res.data.result.records.filter(item => item.site_id.includes('臺北市'));
          setData(temp);

          let siteObj = {}
          temp.forEach(item => {
            if (siteObj[item.site_id] === undefined) {
              siteObj[item.site_id] = 1;
            } else {
              siteObj[item.site_id] += 1;
            }
          });
          setSiteData(Object.keys(siteObj));
        }
      })
    }

    fetch();

  }, [])

  useEffect(() => {
    const obj = {};
    const newObj = {};
    data.forEach((item) => {
      if (obj[item.site_id] === undefined) {
        obj[item.site_id] = [item]
      } else {
        obj[item.site_id].push(item);
      }
    })

    siteData.forEach(site => {
      obj[site].forEach(item => {
        if (newObj[item.site_id] === undefined) {
          newObj[item.site_id] = {
            household_ordinary_f: 0,
            household_ordinary_m: 0,
            household_single_f: 0,
            household_single_m: 0,
          }
        } else {
          newObj[item.site_id].household_ordinary_f += parseInt(item.household_ordinary_f);
          newObj[item.site_id].household_ordinary_m += parseInt(item.household_ordinary_m);
          newObj[item.site_id].household_single_f += parseInt(item.household_single_f);
          newObj[item.site_id].household_single_m += parseInt(item.household_single_m);
        }
      })
    })
    setNewData(newObj);
    setFilterData(newObj.臺北市松山區)
  }, [siteData])

  useEffect(() => {
    console.log('newData', newData);
  }, [newData])

  useEffect(() => {
    console.log('filter', filterData);
    const opt = {
      legend: {},
      tooltip: {},
      dataset: {
        source: [
          ['household', '男', '女'],
          ['單獨生活戶', filterData?.household_single_m, filterData?.household_single_f],
          ['共同生活戶', filterData?.household_ordinary_m, filterData?.household_ordinary_f],
        ]
      },
      xAxis: { type: 'category' },
      yAxis: {},
      grid: {
        left: "20%",
        right: "15%"
      },
      series: [
        { 
          type: 'bar',
          barWidth: '20%',
          barCategoryGap: '5%',
          color: '#4682b4'
        },
        { 
          type: 'bar',
          barWidth: '20%',
          barCategoryGap: '5%',
          color: '#d48265'
        }
      ]
    }
    setOptions(opt);
  }, [filterData])

  const filterArea = (e) => {
    const area = e.target.value;
    setFilterData(newData[area]);
  }

  return (
    <>
      <div className="md:container md:mx-auto md:flex justify-center">
        <div className="lg:basis-1/4 basis-1/3 flex flex-col items-center">
          <img className="w-28 pt-5" src={require('./assets/images/taipeilogo.png')} alt="" />
          <h1 className="py-3 font-bold">110 年人口數按戶別及性別</h1>
        </div>
        <div className="lg:basis-2/4 basis-2/3">
          {
            siteData.length ?
              (
                <div>
                  <div className="md:bg-zinc-100 py-5 px-[10%] flex">
                    <h2 className="inline-block md:w-20 w-1/6 p-1 md:text-xl font-bold">地區</h2>
                    <select className="rounded-md border-solid border-2 p-1 md:w-48 w-5/6" name="area" id="area" onChange={filterArea}>
                      {
                        siteData.map((item) => {
                          return (
                            <option value={item} key={item}>
                              {item.replace("臺北市", "")}
                            </option>
                          );
                        }
                        )
                      }
                    </select>
                  </div>
                  <div className="bg-zinc-100 py-5">
                    <EChartsRender options={options} />
                  </div>
                </div>
              ) : 'loading...'
          }
        </div>
      </div>
    </>
  );
}

export default App;
