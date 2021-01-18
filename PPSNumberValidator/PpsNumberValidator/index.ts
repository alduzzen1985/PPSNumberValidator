import { IInputs, IOutputs } from "./generated/ManifestTypes";
import PPSNumberValidator from './PPSNumberValidator';

import { ITextField, ITextFieldStyleProps, ITextFieldStyles } from 'office-ui-fabric-react';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class PpsNumberValidator implements ComponentFramework.StandardControl<IInputs, IOutputs> {


	private container: HTMLDivElement;
	private _PPSNumberValid: boolean;
	private _PPSNumber: string | null | undefined;

	private notifyOutputChanged: () => void;
	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this.container = container;
		this.notifyOutputChanged = notifyOutputChanged;
		this.renderControl(context);
		// Add control initialization code
	}



	public renderControl(context: ComponentFramework.Context<IInputs>) {


		this._PPSNumber = context.parameters.PPS_Number_Field.raw;
		const DisplayErrorMessage: boolean = (Number(context.parameters.Display_Error_Message.raw) === 1);
		const DisplayIcon: boolean = (Number(context.parameters.Display_Icon.raw) === 1);

		const Error_Message = !context.parameters.Error_Message.raw ? "The insert PPS is incorrect " : context.parameters.Error_Message.raw;

		console.log("Error Message : " + Error_Message);
		console.log(`I've this value as PPS ${this._PPSNumber}`);
		console.log(`Display Error message ? ${DisplayErrorMessage}`);


		let textFieldProperties: any;
		textFieldProperties = {
			onChange: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, textField?: string | undefined) => {
				console.log("EVENT !!!");
				this._PPSNumber = textField;
				this._PPSNumberValid= this.ValidatePPS(this._PPSNumber);
				this.notifyOutputChanged();
			},
			label: "PPS Number",
			value : this._PPSNumber
		};

		let isPPSNumberValid: boolean = this.ValidatePPS(this._PPSNumber);//(ppsNumberValue === "1");

		this._PPSNumberValid = isPPSNumberValid;

		if (DisplayErrorMessage && !isPPSNumberValid) {
			textFieldProperties.errorMessage = Error_Message;
		}

		if (DisplayIcon && !!this._PPSNumber) {
			console.log("Display Icon");
			if (isPPSNumberValid) {
				textFieldProperties.iconProps = { iconName: 'CheckMark' };
			} else {
				textFieldProperties.iconProps = { iconName: 'StatusErrorFull' };
			}

			textFieldProperties.iconFieldStyleProps = (props: ITextFieldStyleProps): Partial<ITextFieldStyles> => ({
				...({
					icon: {
						color: (!isPPSNumberValid) ? 'red' : 'green'
					}
				})
			});
		}



		ReactDOM.render(React.createElement(PPSNumberValidator, textFieldProperties), this.container);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view

		this.renderControl(context);
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			PPS_Number_Field: !this._PPSNumber ? undefined : this._PPSNumber,
			PPS_Number_Valid: this._PPSNumberValid
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		ReactDOM.unmountComponentAtNode(this.container);
	}


	private ValidatePPS(value: string | null | undefined): boolean {
		let validationRegex = /^(\d{7})([A-Za-z]{1,2})$/i;

		if (!value) {
			return true;
		}

		if (!validationRegex.test(value)) {
			return false;
		}

		let numericPart: any = RegExp.$1;
		let checksumCharacter: string = RegExp.$2;

		let multiplyingFactor = 8;
		let sum = 0;

		for (let i = 0; i < numericPart.length; i++) {
			sum += numericPart[i] * multiplyingFactor--;
		}

		if (RegExp.$2[1]) {
			sum += (RegExp.$2[1].toUpperCase().charCodeAt(0) - 64) * 9;
		}

		var checksum = sum % 23;

		if (checksum + 64 !== checksumCharacter.toUpperCase().charCodeAt(0)) {
			return false;
		}
		return true;
	}
}