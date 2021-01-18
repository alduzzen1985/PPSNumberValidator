import * as React from 'react';
import { useState, useEffect } from "react";
import { TextField, ITextField, IIconProps, ITextFieldStyles, ITextFieldStyleProps } from 'office-ui-fabric-react'
import { initializeIcons } from '@uifabric/icons';
//import { initializeIcons, mergeStyles, FontIcon, TextField, IconButton,IIconProps, ChoiceGroup, IChoiceGroupOption, Button , Stack} from "@fluentui/react";

interface ITextFieldPPSProperties {
    onChange: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, textField?: string | undefined) => void;
    errorMessage: string,
    iconFieldStyleProps: ITextFieldStyles,
    iconProps: any,
    value: string | undefined
}


export default class PPSNumberValidator extends React.Component<ITextFieldPPSProperties, {}> {
    render() {
        initializeIcons();

        return (
            <div>
                <TextField errorMessage={this.props.errorMessage} iconProps={this.props.iconProps} styles={this.props.iconFieldStyleProps} onChange={this.props.onChange} value={this.props.value}></TextField>
            </div>
        )
    }
}