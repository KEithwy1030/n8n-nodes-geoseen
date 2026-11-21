import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const BASE_URL = 'https://auditlab.site';

export class GeoSeen implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GeoSeen',
		name: 'geoSeen',
		icon: { light: 'file:geoseen.svg', dark: 'file:geoseen.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{ $parameter["operation"] }}',
		description: 'Check how often AI assistants mention your brand',
		defaults: {
			name: 'GeoSeen',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Brand Mention',
						value: 'getBrandMention',
						action: 'Get a brand mention',
						description: 'Look up one brand by name and get its mention rate',
					},
					{
						name: 'List Leaderboard',
						value: 'listLeaderboard',
						action: 'List the leaderboard',
						description: 'Fetch the ranked brand-visibility leaderboard',
					},
				],
				default: 'getBrandMention',
			},
			{
				displayName: 'Brand Name',
				name: 'brandName',
				type: 'string',
				default: '',
				placeholder: 'Ghost',
				description: 'Brand name to look up. Matches as a case-insensitive substring.',
				displayOptions: {
					show: {
						operation: ['getBrandMention'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				typeOptions: {
					minValue: 1,
					maxValue: 50,
				},
				description: 'Max number of results to return',
				displayOptions: {
					show: {
						operation: ['listLeaderboard'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				if (operation === 'getBrandMention') {
					const brandName = this.getNodeParameter('brandName', itemIndex, '') as string;
					if (!brandName.trim()) {
						throw new NodeOperationError(this.getNode(), 'Enter a brand name to look up.', {
							itemIndex,
						});
					}
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${BASE_URL}/api/public/brands`,
						qs: { q: brandName.trim() },
						json: true,
					});
					const brands = (response as { brands?: unknown[] }).brands ?? [];
					if (brands.length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							`No brand matching "${brandName}" is on the GeoSeen leaderboard yet.`,
							{ itemIndex },
						);
					}
					returnData.push({ json: response as unknown as IDataObject, pairedItem: itemIndex });
				} else {
					const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${BASE_URL}/api/public/leaderboard`,
						json: true,
					});
					const data = response as { brands?: unknown[] };
					if (Array.isArray(data.brands)) {
						data.brands = data.brands.slice(0, limit);
					}
					returnData.push({ json: data as unknown as IDataObject, pairedItem: itemIndex });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {},
						error:
							error instanceof NodeOperationError
								? error
								: new NodeOperationError(this.getNode(), error as Error),
						pairedItem: itemIndex,
					});
					continue;
				}
				if (error instanceof NodeOperationError) {
					throw new NodeOperationError(this.getNode(), error.message, { itemIndex });
				}
				const statusCode = (error as { statusCode?: number }).statusCode;
				if (statusCode === 429) {
					throw new NodeOperationError(
						this.getNode(),
						'GeoSeen rate limit reached (120 requests per hour per IP). Wait before retrying.',
						{ itemIndex },
					);
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
			}
		}

		return [returnData];
	}
}
