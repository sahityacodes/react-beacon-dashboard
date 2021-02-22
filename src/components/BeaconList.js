import React, { Component } from 'react'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import mqtt from 'mqtt';
import Blink from 'react-blink-text';

var client;

class BeaconList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      beaconList: [],
      limit: ''
    };
  }

  componentDidMount() {
    const settings = {
      port: 8080,
      clientId: 'dashboard'
    };
    client = mqtt.connect('mqtt://localhost', settings);
    client.on('connect', function () {
      client.subscribe('/1/101');
    });
    setInterval(this.getPublishedMessage, 3000);
  }


  getPublishedMessage = () => {
    let that = this;
    client.on('message', async function (topic, message) {
      if (message.toString().includes("beaconId")) {
        that.setState({ beaconList: JSON.parse(message.toString()) });
      }
      else {
        if (message.toString().includes("Limit"))
          that.setState({ limit: message.toString() });
        else {
          that.setState({ limit: '' });
        }
      }
    });
  }

  render() {
    let { beaconList, limit } = this.state;
    let dataSize;
    if (beaconList.length == 0) {
      dataSize = "No Beacons Active"
    } else {
      dataSize = null;
    }
    const data_minimal_width = {
      columns: [
        {
          label: 'Room Number',
        },
        {
          label: 'Floor Number',
        },
        {
          label: 'Beacon ID',

        },
        {
          label: 'Status',
        },
        {
          label: 'Entered at',
        }
      ],
      rows: beaconList
    };
    if (dataSize) {
      return (
        <div className="content">
          <div className="container-fluid">
            <h3>{dataSize}</h3>
          </div>
        </div>
      );
    } else {
      return (
        <div className="content">
          <div className="container-fluid">
            <h1>
              <Blink color='red' text={limit}></Blink>
            </h1>
            <MDBTable striped bordered>
              <MDBTableHead columns={data_minimal_width.columns} />
              <MDBTableBody rows={data_minimal_width.rows} />
            </MDBTable>
          </div>
        </div>
      );
    }
  };
}

export default BeaconList;