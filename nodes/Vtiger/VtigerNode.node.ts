import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';
import md5 from 'crypto-js/md5';

export class VtigerNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Vtiger CRM',
		name: 'vtigerNode',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] }}',
		description: 'Vtiger CRM (Open Source) Node',
		icon: 'file:vtiger.svg',
		defaults: {
			name: 'Vtiger',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'vtigerApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				required: true,
				noDataExpression: true,
				options: [
					{
						name: 'Create',
						value: 'create',
					},
					{
						name: 'Delete',
						value: 'delete',
					},
					{
						name: 'Describe',
						value: 'describe',
					},
					{
						name: 'List Types',
						value: 'listtypes',
					},
					{
						name: 'Query',
						value: 'query',
					},
					{
						name: 'Retrieve',
						value: 'retrieve',
					},
					{
						name: 'Update',
						value: 'update',
					},
				],
				default: 'query',
			},
			{
				displayName: 'Entity ID',
				name: 'webservice_id_field',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['retrieve', 'delete', 'update'],
					},
				},
				placeholder: '1x1234',
				description: 'Entity ID formatted as MODULExID',
			},
			{
				displayName: 'Module',
				name: 'elementType_field',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'describe'],
					},
				},
				placeholder: 'Exact module name (case sensitive)',
			},
			{
				displayName: 'Body',
				name: 'element_field',
				type: 'json',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				placeholder: 'Valid JSON structure with fieldname:value properties',
			},
			{
				displayName: 'Query',
				name: 'query_field',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['query'],
					},
				},
				typeOptions: {
					rows: 4,
				},
				placeholder: "SQL supported query ex: SELECT * FROM Leads WHERE email LIKE '%@domain.com';",
			},
		],
	};

	/**
	 * Executes the Vtiger CRM operation based on the provided parameters.
	 * This function performs various operations such as creating, deleting, describing, extending session, listing types,
	 * logging in, logging out, querying, retrieving, and updating data in the Vtiger CRM.
	 *
	 * @returns A promise that resolves to an array of node execution data.
	 */
	/**
	 * Executes the Vtiger CRM operation based on the provided parameters.
	 * @returns A promise that resolves to an array of node execution data.
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let operation = this.getNodeParameter('operation', 0);
		let credential = await this.getCredentials('vtigerApi');

		let sessionData = [];

		const challenge_response = await this.helpers.httpRequest({
			baseURL: credential?.host as string,
			url: '/webservice.php',
			method: 'GET',
			qs: {
				operation: 'getchallenge',
				username: credential?.username as string,
			},
			json: true,
		});

		if (challenge_response?.success) {
			sessionData = await this.helpers.httpRequest({
				baseURL: credential?.host as string,
				url: '/webservice.php',
				method: 'POST',
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
				},
				body: {
					operation: 'login',
					username: credential?.username as string,
					accessKey: md5(challenge_response?.result?.token + credential?.access_key),
				},
				json: true,
			});
		} else {
			throw new NodeOperationError(
				this.getNode(),
				challenge_response.error.message + ' (' + challenge_response.error.code + ')',
			);
		}

		const token = sessionData?.result?.sessionName;

		let response = null;

		switch (operation) {
			case 'create':
				response = await this.helpers.httpRequest({
					baseURL: credential?.host as string,
					url: '/webservice.php',
					method: 'POST',
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					body: {
						operation: 'create',
						sessionName: token as string,
						elementType: this.getNodeParameter('elementType_field', 0) as string,
						element: this.getNodeParameter('element_field', 0),
					},
					json: true,
				});
				break;
			case 'delete':
				response = await this.helpers.httpRequest({
					baseURL: credential?.host as string,
					url: '/webservice.php',
					method: 'POST',
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					body: {
						operation: 'delete',
						sessionName: token as string,
						id: this.getNodeParameter('webservice_id_field', 0) as string,
					},
					json: true,
				});
				break;
			case 'describe':
				response = await this.helpers.httpRequest({
					baseURL: credential?.host as string,
					url: '/webservice.php',
					method: 'GET',
					qs: {
						operation: 'describe',
						sessionName: token as string,
						elementType: this.getNodeParameter('elementType_field', 0) as string,
					},
					json: true,
				});
				break;
			case 'listtypes':
				response = await this.helpers.httpRequest({
					baseURL: credential?.host as string,
					url: '/webservice.php',
					method: 'POST',
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					body: {
						operation: 'listtypes',
						sessionName: token as string,
					},
					json: true,
				});
				break;
			case 'query':
				response = await this.helpers.httpRequest({
					baseURL: credential?.host as string,
					url: '/webservice.php',
					method: 'GET',
					qs: {
						operation: 'query',
						sessionName: token as string,
						query: this.getNodeParameter('query_field', 0) as string,
					},
					json: true,
				});
				break;
			case 'retrieve':
				response = await this.helpers.httpRequest({
					baseURL: credential?.host as string,
					url: '/webservice.php',
					method: 'GET',
					qs: {
						operation: 'retrieve',
						sessionName: token as string,
						id: this.getNodeParameter('webservice_id_field', 0) as string,
					},
					json: true,
				});
				break;
			case 'update':
				const entity = await this.helpers.httpRequest({
					baseURL: credential?.host as string,
					url: '/webservice.php',
					method: 'GET',
					qs: {
						operation: 'retrieve',
						sessionName: token as string,
						id: this.getNodeParameter('webservice_id_field', 0) as string,
					},
					json: true,
				});

				if (!entity?.success) {
					throw new NodeOperationError(
						this.getNode(),
						'Entity does not exists or ' + entity.error?.message,
					);
				}

				const userInput = JSON.parse(this.getNodeParameter('element_field', 0) as string);

				response = await this.helpers.httpRequest({
					baseURL: credential?.host as string,
					url: '/webservice.php',
					method: 'POST',
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					body: {
						operation: 'update',
						sessionName: token as string,
						element: JSON.stringify({ ...entity.result, ...userInput }),
					},
					json: true,
				});
				break;
			default:
				throw new NodeOperationError(this.getNode(), operation + ' operation is not implemented.');
		}

		return [this.helpers.returnJsonArray(response)];
	}
}
