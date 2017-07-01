import React, { Component } from 'react';
import './App.css';

function tyre_circumference(W,P,R) {
  return 25.4 * Math.PI * R + Math.PI * P * W / 50;
}

class Header extends Component {
  render() {
    return (
	  <div className="App-header">
		<h2>{this.props.masthead}</h2>
	  </div>
    );
  }
}

class Deviation extends Component {
  render() {
	let deviationClassName = ((this.props.deviation.circumference > 2) || (this.props.deviation.circumference < -2)) ? 'highDeviation' : (((this.props.deviation.circumference > 1) || (this.props.deviation.circumference < -1)) ? 'mediumDeviation' : 'lowDeviation');
	let gcdeviationClassName = ((this.props.deviation.ground_clearance > 20) || (this.props.deviation.ground_clearance < -20)) ? 'highDeviation' : (((this.props.deviation.ground_clearance > 10) || (this.props.deviation.ground_clearance < -10)) ? 'mediumDeviation' : 'lowDeviation');
	let pdeviationClassName = ((this.props.deviation.contact_patch > 10) || (this.props.deviation.contact_patch < -10)) ? 'highDeviation' : (((this.props.deviation.contact_patch > 5) || (this.props.deviation.contact_patch < -5)) ? 'mediumDeviation' : 'lowDeviation');
	return (
	    <div className="deviation">
			<p>Speedo Error: <span className={deviationClassName}>{this.props.deviation.circumference}% (km/h)</span></p>
			<p>Odo Error: <span className={deviationClassName}>{this.props.deviation.circumference}% (km)</span></p>
			<p>GC Change: <span className={gcdeviationClassName}>{this.props.deviation.ground_clearance} (mm)</span></p>
			<p>Contact Change: <span className={pdeviationClassName}>~ {this.props.deviation.contact_patch}% (sqmm)</span></p>
	    </div>
	);
  }
}

class InputForm extends Component {
  render() {
	let widthRows = [], profileRows = [], radiusRows = [];
	for (let i=0;i<9;i++) {
	  widthRows.push(<option key={235 + i*10} value={235 + i*10}>{235 + i*10} mm</option>);
	}
	for (let i=0;i<6;i++) {
	  profileRows.push(<option key={60 + i*5} value={60 + i*5}>{60 + i*5} %</option>);
	}
	for (let i=0;i<3;i++) {
	  radiusRows.push(<option key={15 + i} value={15 + i}>{(15 + i) + ' in'}</option>);
	}

	return (
	  <form>
		<div className="inputform">
			<label htmlFor="width_mm">Tyre Width</label>
			<select name="width_mm" id="width_mm" value={this.props.width_value} onChange={(event) => this.props.onWidthChange(event)}>
				{widthRows}
			</select><br />
			<label htmlFor="profile_pc">Tyre Profile</label>
			<select name="profile_pc" id="profile_pc" value={this.props.profile_value} onChange={(event) => this.props.onProfileChange(event)}>
				{profileRows}
			</select><br />
			<label htmlFor="radius_in">Tyre Radius</label>
			<select name="radius_in" id="radius_in" value={this.props.radius_value} onChange={(event) => this.props.onRadiusChange(event)}>
				{radiusRows}
			</select><br />
		</div>
		<button onClick={() => this.props.onBackToStock()}>Reset to Stock</button>
	  </form>
	);
  }
}

class App extends Component {
  constructor(props) {
    super(props);
	const c_stock = tyre_circumference(245, 70, 16);
	const gc_stock = 245 * 0.7;
	this.state = {width_value: 245, profile_value: 70, radius_value: 16, deviation: {circumference: 0, ground_clearance: 0, contact_patch: 0}, c_stock: c_stock, gc_stock: gc_stock};

	this.handleWidthChange = this.handleWidthChange.bind(this);
	this.handleProfileChange = this.handleProfileChange.bind(this);
	this.handleRadiusChange = this.handleRadiusChange.bind(this);
  }

  handleWidthChange(event) {
	this.setState({width_value: event.target.value});
	let delta_circumference = Math.round((tyre_circumference(event.target.value, this.state.profile_value, this.state.radius_value) - this.state.c_stock) / this.state.c_stock * 10000) / 100;
	let delta_clearance = event.target.value * this.state.profile_value / 100 - this.state.gc_stock + (this.state.radius_value - 16) * 25.4;
	let delta_contactpatch =Math.round((event.target.value / 245 - 1) * 10000) / 100;
	this.setState({deviation: {circumference: delta_circumference, ground_clearance: delta_clearance, contact_patch: delta_contactpatch}});
  }
  handleProfileChange(event) {
	this.setState({profile_value: event.target.value});
	let delta_circumference = Math.round((tyre_circumference(this.state.width_value, event.target.value, this.state.radius_value) - this.state.c_stock) / this.state.c_stock * 10000) / 100;
	let delta_clearance = this.state.width_value * event.target.value / 100 - this.state.gc_stock + (this.state.radius_value - 16) * 25.4;
	let delta_contactpatch = Math.round((this.state.width_value / 245 - 1) * 10000) / 100;
	this.setState({deviation: {circumference: delta_circumference, ground_clearance: delta_clearance, contact_patch: delta_contactpatch}});
  }
  handleRadiusChange(event) {
	this.setState({radius_value: event.target.value});
	let delta_circumference = Math.round((tyre_circumference(this.state.width_value, this.state.profile_value, event.target.value) - this.state.c_stock) / this.state.c_stock * 10000) / 100;
	let delta_clearance = this.state.width_value * this.state.profile_value / 100 - this.state.gc_stock + (event.target.value - 16) * 25.4;
	let delta_contactpatch = Math.round((this.state.width_value / 245 - 1) * 10000) / 100;
	this.setState({deviation: {circumference: delta_circumference, ground_clearance: delta_clearance, contact_patch: delta_contactpatch}});
  }
  backToStock() {
	this.setState({width_value: 245, profile_value: 70, radius_value: 16});
	this.setState({deviation: {circumference: 0, ground_clearance: 0, contact_patch: 0}});
  }

  render() {
    return (
      <div className="App">
		<Header masthead="V-Cross: Tyre Calc" />
		<Deviation deviation={this.state.deviation} />
	    <InputForm
			width_value={this.state.width_value} profile_value={this.state.profile_value} radius_value={this.state.radius_value}
			onWidthChange={(event) => this.handleWidthChange(event)} onProfileChange={(event) => this.handleProfileChange(event)} onRadiusChange={(event) => this.handleRadiusChange(event)}
			onBackToStock={() => this.backToStock()}
		/>
      </div>
    );
  }
}

export default App;
