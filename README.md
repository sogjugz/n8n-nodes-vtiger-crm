# n8n-nodes-vtiger-crm

This is an n8n community node that allows you to interact with the VTiger CRM (open source) API within your n8n workflows.

VTiger CRM (Customer Relationship Management) is a user-friendly, free, fully-featured, and 100% open-source CRM system, specifically designed for small and medium-sized businesses.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)
- [Version history](#version-history)

## Installation

To install this community node, follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) provided in the n8n community nodes documentation.

## Operations

This node supports the following operations with VTiger CRM:

- Create Entities
- Update Entities
- Retrieve Entities
- Query Entities
- List Types
- Delete Entities
- Describe Entity

## Credentials

The VTiger API requires authentication. You need to provide your VTiger CRM instance URL, a username and an access key with sufficient privileges to perform operations on the entities.

### Host

The host is the URL of your VTiger CRM instance. It should be in the format `https://your-vtiger-instance.com`. **Important**: Do not include a trailing slash `/` at the end of the URL and do not include the `/webservice.php` path.

### Username

The username is ussualy the email address of the user you want to authenticate as.

### Access Key

The access key is the API key of the user you want to authenticate as. You can find the access key information under “My Preferences” in the CRM Web UI.


## Compatibility

This node has been tested with VTiger version 6.\* and is expected to work with VTiger version 7 as well.

## Usage

To effectively use this node, you should be familiar with the concepts of Entities, naming conventions, and module prefixes in VTiger. For the Query operation, a basic understanding of SQL is also required. You can refer to the official VTiger documentation to get a comprehensive understanding of the general usage of operations.

### Create and Update Operations

Create and Update operations require a `Body` input. This should be a valid JSON object with attribute names as keys and their corresponding values. You can obtain the attribute names using the `Describe` operation. Example:

```json
{
	"firstname": "John",
	"lastname": "Doe",
	"cf_1234": "Customer"
}
```

**For Create operations, the required fields must be provided.**

### Retrieve, Update and Delete operations

Retrieve and Update operations require an `Entity ID`. This must follow the API convention (MODULExID). Example:

`10x1234`

### Query operation

The Query operation requires a valid SQL query supported by the API to query an entity. Example:

```sql
SELECT * FROM Leads WHERE email LIKE '%@domain.com';
```

**Note that it ends with a semicolon**

You can refer to the limitations of the query [here](https://community.vtiger.com/help/vtigercrm/developers/third-party-app-integration.html#query-operation)

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [VTiger API Rest documentation](https://community.vtiger.com/help/vtigercrm/developers/third-party-app-integration.html)

## Version History

- **v0.1.0**: Initial release.
- **v0.1.1**: Fixed a bug in the `Update` operation.
- **v0.1.2**: Fixed a bug in the `Query` operation.
- **v0.1.3**: Remove code from error message.
- **v0.1.4**: Update dependencies and use new INodeConnectionType types.
