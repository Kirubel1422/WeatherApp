const axios = require("axios");
const model = require("../data_model/dataModel");

const getHandler = async (req, res) => {
  try {
    if (req.query === undefined) {
      res.status(420).json({ status: "Invalid City" });
      return;
    }

    cityReq = req.query.city;
    let BASE_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityReq}&units=metric&appid=${process.env.API}`;

    const response = await axios.get(BASE_URL);

    const data = {
      name: response.data.name,
      main: response.data.weather[0].main,
      description: response.data.weather[0].description,
      coord: response.data.coord,
      temperature: response.data.main.temp,
      humudity: response.data.main.humudity,
    };

    res.json({ weatherData: data });
  } catch (error) {
    res.status(404).json({ msg: "City Not Found" });
  }
};

const postHandler = async (req, res) => {
  try {
    const request = req.body;
    const { cityReq } = req.body;
    request["timeStamp"] = new Date().toISOString();

    let BASE_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityReq}&units=metric&appid=${process.env.API}`;

    const response = await axios.get(BASE_URL);
    await model.create(request); // Save to DB

    const data = {
      name: response.data.name,
      main: response.data.weather[0].main,
      description: response.data.weather[0].description,
      coord: response.data.coord,
      temperature: response.data.main.temp,
      humudity: response.data.main.humudity,
    };

    res.json({ weatherData: data });
  } catch (error) {
    res.status(404).json({ msg: "City not found" });
  }
};

const deleteHandler = async (req, res) => {
  const id = req.params.id;
  try {
    await model.findOneAndDelete({ _id: id });
    res.json({ deleted: true });
  } catch (error) {
    res.status(404).json({ deleted: false });
  }
};

module.exports = { getHandler, postHandler, deleteHandler };
