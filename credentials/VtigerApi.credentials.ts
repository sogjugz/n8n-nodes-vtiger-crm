import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class VtigerApi implements ICredentialType {
	name = 'vtigerApi';
	displayName = 'Vtiger CRM Credentials API';
	documentationUrl =
		'https://github.com/sogjugz/n8n-nodes-vtiger-crm/tree/master?tab=readme-ov-file#installation';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Access Key',
			name: 'access_key',
			type: 'string',
			required: true,
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
