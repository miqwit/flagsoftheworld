import React from 'react';

class App extends React.Component {
    constructor() {
        super();
		
		this.state = {}
		
		var loaded_flags = require('./data/flags.json');
		
		// The first "flag" are the filters. Format them for display.
		var filters_def = loaded_flags.shift();
		var filters = [];
		for (var prop in filters_def) {
			if (prop == "iso") continue;
			if (filters_def[prop] == "header") continue;
			
			filters.push({"name": prop, "label": filters_def[prop]});
			this.state[prop] = false; // Setup all filters to false in state
		}
		
        this.state["filters_def"] = filters;
		this.state["active_flags"] = loaded_flags;
		this.state["all_flags"] = loaded_flags;
        
		
        this.updateState = this.updateState.bind(this);
        this.updateStateModal = this.updateStateModal.bind(this);
    }

	updateState(e) {
		const target = e.target
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name

		this.state[name] = value;
		this.setState({"active_flags": this.applyFilter()});
	}
	
	updateStateModal(e) {
		const target = e.target;
		
		this.setState({
			"modal_src": target.src,
			"modal_title": target.getAttribute('data-name')
		});
	}
    
	applyFilter() {
		var active_flags = [];
		var one_true = false;
		
		for (var flag in this.state.all_flags) {
			var the_flag = this.state.all_flags[flag];
			for (var f in this.state) {
				// Check both filter active and flag has this feature
				if ((this.state[f] == true) && (the_flag[f] == true)) {
					one_true = true;
					active_flags.push(the_flag);
				}
			}
		}
		
		// Display all if nothing checked
		if (!one_true) {
			active_flags = this.state.all_flags;
		}
		
		return active_flags;
	}
	
    render() {
        return (
            <div>
                <Header />
				{this.state.filters_def.map((filter, i) => <Filter key={i} label={filter.label} name={filter.name} onchange={this.updateState}/>) }
				
				<Modal src={this.state.modal_src} title={this.state.modal_title} />
				
				<div className="row"></div>
				<br/>
                
				<div className="row">
                        {this.state.active_flags
						.map((flag, i) => <FlagThumbnail key={i} data={flag} imgPath={this.props.propImgPath} status={this.state} onclick={this.updateStateModal}/>)}
                </div>
            </div>
        );
    }
}

// Main options here. 
App.defaultProps = {
	propImgPath: "img"
}

class Header extends React.Component {
    render() {
        return (
            <div>
                <h1>Les drapeaux du monde</h1>
            </div>
        );
    }
}

class Filter extends React.Component {
    render() {
        return (
			<div className="col-sm-3">
				<input type="checkbox" onChange={this.props.onchange} name={this.props.name} /> {this.props.label}
			</div>
        );
    }
}

class Modal extends React.Component {
    render() {
        return (
			<div id="modalFlagBig" className="modal fade" role="dialog">
				<div className="modal-dialog modal-lg">
				
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" className="close" data-dismiss="modal">&times;</button>
						<h4 className="modal-title">{this.props.title}</h4>
					</div>
					
					<div className="modal-body">
						<img src={this.props.src} style={{width: '100%'}} />
					</div>
					
					<div className="modal-footer">
						<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
					</div>
				</div>

				</div>
			</div>
		);
    }
}

class FlagThumbnail extends React.Component {
    render() {
        return (
		<div className="col-sm-2 col-md-2 text-center">
			{
				this.props.status.num_stars && !this.props.data.num_stars ? null : 
					<div className="thumbnail">
					
						<a data-toggle="modal" data-target="#modalFlagBig" onClick={this.props.onclick}>
							<img className="small_flag" src={this.props.imgPath + "/" + this.props.data.iso + ".svg"} data-name={this.props.data.french_name}/>
						</a>
						
						<div className="caption">
							<b>{this.props.data.french_name}</b>
						</div>
					</div>
			}
		</div>
        );
    }
}

export default App;