# n8n-nodes-vtiger-crm

This is an n8n community node. It lets you use VTiger CRM (open source) API in your n8n workflows.

Vtiger CRM (Customer Relationship Management) is an easy to use, free, fully featured, 100% Open Source CRM system that specially designed for small and medium sized businesses.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials) <!-- delete if no auth needed -->  
[Compatibility](#compatibility)  
[Usage](#usage) <!-- delete if not using this section -->  
[Resources](#resources)  
[Version history](#version-history) <!-- delete if not using this section -->

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- Create Entities
- Update Entities
- Retrieve Entities
- Query Entities
- List types
- Delete Entities

## Credentials

The Vtiger API require authentication. You must use username and accessKey with sufficient privileges to operate the entities.
You can find accessKey information under “My Preferences” in the CRM Web UI

## Compatibility

Tested with VTiger 6.\*. Should work with Vtiger 7 too.

## Usage

You must know the concept of Entities, name conventions, modules prefixes and in case the use of Query operation, a basic knowledege of SQL. You can follow the official documentation to get an idea of the general usage of operations.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Vtiger API Rest documentation](https://community.vtiger.com/help/vtigercrm/developers/third-party-app-integration.html)

## Version history

- v1.0.0: Initial release.
