import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { TiWeatherCloudy } from "react-icons/ti";
import { IoAddCircleSharp } from "react-icons/io5";
import { IoReload } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const App = () => {
  const [cities, setCities] = useState([]); // For already saved cities
  const [city, setCity] = useState(); // For the requested city
  const [pop, setPop] = useState(false);
  const [newPop, setNewPop] = useState(false);

  const addCity = useRef(null);
  const input = useRef(null);
  const BASE_URL = "http://localhost:3000/";

  const fetchCities = async () => {
    // Fetch Cities already saved by the user
    try {
      const response = await axios.get(BASE_URL);
      setCities(response.data.weatherData);
    } catch (error) {
      console.error(error);
    }
  };

  const postHandler = async () => {
    const city = addCity.current.value;
    try {
      const response = await axios.post(BASE_URL + "weather", {
        cityReq: city,
      });
      getWeatherData(city);
      fetchCities();
      setNewPop(false);
      input.current.value = city;
    } catch (error) {
      if (error.response.status === 404) {
        alert(error.response.data.msg);
        addCity.current.value = "";
      }
    }
  };
  const getWeatherData = async (CITY) => {
    const city = CITY === undefined ? input.current.value : CITY;
    try {
      const response = await axios.get(BASE_URL + "weather?city=" + city);
      setCity(response.data.weatherData);
      setPop(true);
    } catch (error) {
      if (error.response.status === 404) {
        alert(error.response.data.msg);
        input.current.value = "";
      }
    }
  };

  const displayWeatherData = () => {
    return (
      <div className="px-3 py-2 md:px-5 md:py-3 bg-slate-600 border-transparent rounded-md text-slate-300 shadow-lg shadow-slate-700">
        <table className="table-auto">
          <tbody>
            <tr>
              <td className="text-sm font-semibold pr-8">City:</td>
              <td className="md:text-lg">{city.name}</td>
            </tr>
            <tr>
              <td className="text-sm font-semibold pr-8">Type:</td>
              <td className="md:text-lg">{city.main}</td>
            </tr>
            <tr>
              <td className="text-sm font-semibold pr-8">Description:</td>
              <td className="capitalize md:text-lg">{city.description}</td>
            </tr>
            <tr>
              <td className="text-sm font-semibold pr-8">Coordinate:</td>
              <td>
                <table>
                  <tbody>
                    <tr>
                      <td className="pr-2 md:text-lg">Lat:</td>
                      <td>{city.coord.lat}&deg;</td>
                    </tr>
                    <tr>
                      <td className="pr-2 md:text-lg">Lon:</td>
                      <td>{city.coord.lon}&deg;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className="text-sm font-semibold pr-4">Temperature:</td>
              <td className="md:text-lg">{city.temperature}&deg;c</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="flex items-center">
              <button className="mt-3">
                <MdCancel
                  className="text-2xl"
                  onClick={() => setPop((prev) => !prev)}
                />
              </button>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };
  useEffect(() => {
    fetchCities();
  }, []);

  const displaySetCity = () => {
    return (
      <div
        className={`relative bg-slate-600 px-2 py-10 md:px-24 md:py-14 border-transparent rounded-lg border-slate-400 border-2 bg-opacity-80 transition-all duration-300 `}
        style={{
          position: "absolute",
          top: "50%",
          right: "50%",
          transform: "translate(50%, -50%)",
        }}
      >
        <div>
          <input
            type="text"
            placeholder="Write a city name"
            className={`px-1 py-1 bg-slate-100 border-transparent rounded-lg transition-all duration-400 placeholder:text-lg placeholder:tracking-wider outline-none w-full md:px-5 md:py-4 `}
            ref={addCity}
          />
        </div>
        <div className="py-1">
          <button
            onClick={() => postHandler()}
            className="w-full bg-slate-300 md:py-2 rounded-lg hover:bg-slate-400 transition-all duration-300 ease-out"
          >
            Add City
          </button>
        </div>
        <div className="flex justify-center border-transparent rounded-full">
          <MdCancel
            className="text-slate-400 text-3xl cursor-pointer hover:text-slate-300 "
            onClick={() => {
              setNewPop((prev) => !prev);
            }}
          />
        </div>
      </div>
    );
  };

  const retrieveWeatherData = async (id) => {
    try {
      const city = cities.filter((city) => {
        return city._id === id;
      });
      const cityName = city[0].cityReq;
      input.current.value = cityName;
      const response = await axios.get(BASE_URL + "weather?city=" + cityName);
      if (response.status !== 200) {
        console.log(response.status);
        return;
      }
      setCity(response.data.weatherData);
      setPop(true);
      fetchCities();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteWeatherData = async (id) => {
    try {
      const response = await axios.delete(BASE_URL + "weather/" + id);
      if (response.status !== 200) {
        console.log(response.statusText);
        return;
      }
      fetchCities();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-700 h-screen flex justify-center items-center">
      <div className={`md:w-96 ${newPop ? "opacity-75" : "opacity-100"} `}>
        <div className="py-2">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-300  flex justify-center items-center gap-1 md:gap-2">
            <div className="">
              <TiWeatherCloudy />
            </div>
            <div>Weather App</div>
          </h1>
        </div>
        <div className="flex justify-center items-center gap-1 py-2 relative">
          <input
            type="text"
            ref={input}
            placeholder="Enter a city"
            className={`
            w-full transition-all duration-300 px-3 py-2 md:px-5 md:py-3 border-transparent rounded-full bg-slate-300 placeholder:text-center placeholder:tracking-wider placeholder:font-semibold placeholder:text-slate-600 placeholder:opacity-50 focus:ring-2 focus:ring-sky-slate-300 outline-none text-lg`}
          />
          <button
            onClick={() => getWeatherData()}
            className="md:p-4 p-3 absolute right-0 bg-slate-400  items-center border-none rounded-full hover:bg-slate-400 transition-all hover:scale-90 duration-300 ease-out"
          >
            <FaSearch color="white" />
          </button>
        </div>
        {pop && displayWeatherData()}
        <div className="w-full">{newPop && displaySetCity()}</div>
        <div className="flex justify-center items-center md:py-4 py-2">
          <button onClick={() => setNewPop((prev) => !prev)}>
            <IoAddCircleSharp className="text-slate-500  hover:text-slate-400 md:text-4xl text-3xl" />
          </button>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full">
            <ul className="w-full">
              {cities.map((city, index) => (
                <div>
                  <li
                    key={index}
                    className="flex justify-between items-center text-slate-800 bg-slate-500 my-1 w-full pl-3 pr-1 border-transparent rounded-md py-1"
                  >
                    <div>
                      <h4 className="md:text-lg font-semibold">
                        {city.cityReq}
                      </h4>
                    </div>
                    <div className="flex md:gap-1">
                      <button onClick={() => retrieveWeatherData(city._id)}>
                        <IoReload className=" text-slate-100" />
                      </button>
                      <button onClick={() => deleteWeatherData(city._id)}>
                        <MdDelete className=" text-slate-100" />
                      </button>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
