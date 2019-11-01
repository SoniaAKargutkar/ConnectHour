import React, { Component } from "react";
import EventEdit from "./EventEdit";
import EventCreate from "./EventCreate";
import { Animated } from "react-animated-css";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import "../../App.css";
import moment from 'moment';


class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      eventList: [],
      //registered_vol:[],
      editFormId: ""
    };
    this.addEvent = this.addEvent.bind(this);
    this.toggleCreateForm = this.toggleCreateForm.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.openEditReset = this.openEditReset.bind(this);
  }
  toggleCreateForm() {
    this.setState({
      showForm: !this.state.showForm,
      editFormId: ""
    });
  }
  openEdit = e => {
    this.setState({ editFormId: e.target.id });
  };
  openEditReset() {
    this.setState({ editFormId: "" });
  }

  componentDidMount = () => {
    console.log(Cookies.get());

    if (Cookies.get("token") && Cookies.get("type") === "/odashboard/") {
      const ID = jwt_decode(Cookies.get("token")).uid;
      const p = this;
      axios
        .get("/event/organizer/" + ID)
        .then(function(response) {
          p.setState({ eventList: response.data });
          console.log(p.state.eventList);
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.props.history.push("/");
    }
  };

  addEvent(event) {
    let eventList = this.state.eventList;
    eventList.push(event);
    this.setState({ eventList: this.state.eventList });
  }

  render() {
    return (
      <React.Fragment>
        <div className="container col-6 text-center Events">
          <button onClick={this.toggleCreateForm} className="btn btn-info m-2 ">
            Create Event
          </button>

          {this.state.eventList.map(event => (
            <Animated
              key={event.id}
              animationIn="bounceInRight"
              animateOnMount={false}
              isVisible={true}
            >
              <Event
                key={event.id}
                editFormId={this.state.editFormId}
                event={event}
                openEdit={this.openEdit}
                ID={jwt_decode(Cookies.get("token")).uid}
                openEditReset={this.openEditReset}
              ></Event>
            </Animated>
          ))}

          <div
            className={
              !this.state.showForm
                ? "EventCreate displaynone"
                : "EventCreate displayblock"
            }
          >
            <button
              onClick={this.toggleCreateForm}
              className="btn btn-danger m-2 "
            >
              Close
            </button>
            <EventCreate
              addEvent={this.addEvent}
              toggleCreateForm={this.toggleCreateForm}
              ID={
                Cookies.get("token") ? jwt_decode(Cookies.get("token")).uid : ""
              }
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class Event extends Component {

  render() {
    

    return (
      <div className="card m-2 shadow p-3 mb-5 bg-white rounded Eventlist">
        <h5 className="card-title">{this.props.event.EventName}</h5>
        <span>{moment(this.props.event.StartTime).format('YYYY-MM-DD')}</span>
        <hr />
        <p className="card-text">{this.props.event.Description}</p>
        {this.props.editFormId != this.props.event.id && (
          <input
            className="m-auto btn btn-info "
            id={this.props.event.id}
            onClick={this.props.openEdit}
            value="Edit Event"
            type="button"
          />
        )}

        {this.props.editFormId != this.props.event.id && (
          <input
            className="m-auto btn btn-danger "
            id={this.props.event.id}
            onClick={this.deleteEvent}
            value="Delete Event"
            type="button"
          />
        )}
        {this.props.editFormId == this.props.event.id && (
          <EventEdit
            eventdata={this.props.event}
            openEditReset={this.props.openEditReset}
            ID={jwt_decode(Cookies.get("token")).uid}
          />
        )}
        <hr />

        {/* <div className="accordion" id={this.props.event.id}>
          <div>
            <div id="headingOne">
              <button
                className="btn text-dark"
                type="button"
                id={this.props.event.id}
                data-toggle="collapse"
                data-target={"#collapse" + this.props.event.id}
                aria-expanded="true"
                aria-controls="collapseOne"
                // onClick={this.getRegisteredVolunteers}
              >
                Registered Volunteers
              </button>
            </div>

            <div
              id={"collapse" + this.props.event.id}
              className="collapse "
              onClick={this.getRegisteredVolunteers}
              aria-labelledby="headingOne"
              data-parent="#accordionExample"
            >{
              this.state.registered_vol.map(vol => (
              <p>{vol.FirstName}</p>
            ))}
             
            </div>
          </div>
        </div> */}
      </div>
    );
  }

  // getRegisteredVolunteers = (eventid) => {
  //   let thisstate=this
  //   axios
  //   .get(
  //     "/event/organizer/registered/" +
  //       eventid
  //   )
  //   .then(function(response, props) {
  //    thisstate.setState({registered_vol:response.data})
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   });
  // };

  deleteEvent = e => {
    let eventid = e.target.id;
    axios
      .delete(
        "/event/" +
          jwt_decode(Cookies.get("token")).uid +
          "/" +
          eventid
      )
      .then(function(response, props) {
        window.location.reload();
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}

export default Events;
