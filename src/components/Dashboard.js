import React, { Component } from 'react'
import ChartistGraph from 'react-chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import '../assets/css/styles.css';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      beaconDurationData: [],
      beaconCountPerRoom: [],
      beaconCountPerDay: []
    }
  }

  componentDidMount() {
    this.getBeaconData();
  }

  getBeaconData = () => {
    fetch('http://localhost:3000/api/beacon/duration', {
      method: 'GET',
      mode: 'cors'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          beaconDurationData: responseJson
        })
      })
      .catch((error) => {
        console.error(error);
      });

    fetch('http://localhost:3000/api/beacon/beaconCountPerRoom', {
      method: 'GET',
      mode: 'cors'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          beaconCountPerRoom: responseJson
        })
      })
      .catch((error) => {
        console.error(error);
      });

    fetch('http://localhost:3000/api/beacon/beaconCountPerDay', {
      method: 'GET',
      mode: 'cors'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          beaconCountPerDay: responseJson
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    let { beaconDurationData, beaconCountPerRoom, beaconCountPerDay } = this.state;
    let pieData, barData1
    if(beaconCountPerRoom.length==0) 
      pieData = 'No Beacons Active'
      if(beaconDurationData.length==0) 
      barData1 = 'Nobody entered today'
    let dataPie = {
      labels: beaconCountPerRoom.map((doc) => doc.beaconCount + ' Active'),
      series: beaconCountPerRoom.map((doc) => doc.beaconCount),
    }
    let dataBeacon = {
      labels: beaconDurationData.map((doc) => String(doc.beaconId)),
      series: [
        beaconDurationData.map((doc) => {
          if (doc.room === '101')
            return doc.duration;
        }), beaconDurationData.map((doc) => {
          if (doc.room === '102')
            return doc.duration;
        })
      ]
    }
    let dataBeaconPerDay = {
      labels: [],
      series: []
    }
    let rowData = [];
    var uniqueDay = beaconCountPerDay.map((doc) => doc.day).filter((v, i, a) => a.indexOf(v) === i);
    for(let i=0; i < uniqueDay.length; i++){
      for(let j=0; j < beaconCountPerDay.length; j++){
        if(beaconCountPerDay[j].day == uniqueDay[i]){
          dataBeaconPerDay.labels.push(beaconCountPerDay[j]._id.Hours[0]+':00 - '+beaconCountPerDay[j]._id.Hours[1]+':00')
           rowData.push({ meta: 'Day: '+beaconCountPerDay[j].day ,value: beaconCountPerDay[j]._id.beaconCount})
         }else{
          rowData.push({ meta: 'Day: '+beaconCountPerDay[j].day ,value: 0})
         }
      }
      dataBeaconPerDay.series.push(rowData);
      rowData = [];
    }
    console.log(dataBeaconPerDay.series)

    const options = {
      axisY: {
        labelInterpolationFnc: function (value, index) {
          return index % 2 === 0 ? value : null;
        }
      },
      plugins: [
        ChartistTooltip({
          appendToBody: false,
        })
      ]
    }

    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <div className="card ">
                <div className="card-header ">
                  <h4 className="card-title">Active Beacons</h4>
                  <p className="card-category">All Rooms</p>
                </div>
                <div className="card-body ">
                  <h4>{pieData}</h4>
                  <ChartistGraph data={dataPie} type="Pie" />
                  <div className="legend">
                    <i className="fa fa-circle text-info"></i> Room 101
                    <i className="fa fa-circle text-danger"></i> Room 102
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-header ">
                  <h4 className="card-title">Duration of Exited Beacons</h4>
                  <p className="card-category">Today's Data</p>
                </div>
                <div className="card-body ">
                  <h4>{barData1}</h4>
                  <ChartistGraph data={dataBeacon} type="Bar" />
                </div>
                <div className="card-footer ">
                  <div className="legend">
                    <i className="fa fa-square text-info"></i> Room 101
                    <i className="fa fa-square text-danger"></i> Room 102
                </div>
                </div>
              </div>
            </div>

          </div>
          <div className="row">
            <div className="col-md-10">
              <div className="card">
                <div className="card-header ">
                  <h4 className="card-title">Number of Beacons In Day Per Lecture</h4>
                  <p className="card-category">Historical Data</p>
                </div>
                <div className="card-body ">
                  <ChartistGraph data={dataBeaconPerDay} options={options} type={'Line'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard