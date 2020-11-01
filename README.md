# tmclient
Node client for ThingsMobile API

## Table of contents
* [Description](#description)
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
* [Errors](#errors)
* [API docs](#api-docs)

## Description
This is a client for [ThingsMobile](https://www.thingsmobile.com/) API that allow to activate, block and unblock a SIM, get information about it or get the details of the credit history.

**You must be a registered user to use this client correctly!**

## Installation
Simply install the module with npm
```bash
npm install tmclient
```

## Usage
First of all you have to **create a client** instance passing by arguments the **username** of your ThingsMobile account and the API **token** generated in the private section.

_**NOTE**: to generate an API token you have to go to the [ThingsMobile website](https://www.thingsmobile.com/), login with your credentials, go under `profile` section and at the bottom of the page click on `generate token`._

```javascript
const ThingsMobile = require('tmclient');

// your TM username and API token
let username = 'username@example.com';
let token = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

// create a client instance
const tm = new ThingsMobile(username, token);
```

After creating the client instance just have to use the API provided by ThingsMobile.

For example this is the code to get the status of a SIM:
```javascript
// the MSISDN of the SIM
let msisdn = 'xxxxxxxxxxxxxxx';
tm.simStatus(msisdn, function (err, status) {
    if (err) {
        console.error(err);
        return;
    }

    console.log(JSON.stringify(status, null, 4));
});
```

## API
Currently the supported API are 6.

_**NOTE**: You can find a description of the API in the `profile` section in ThingsMobile website._

#### SIM management

##### `tm.activateSim(msisdn, simBarcode, callback)`

##### `tm.blockSim(msisdn, callback)`

##### `tm.unblockSim(msisdn, callback)`

#### SIM details

##### `tm.simStatus(msisdn, callback)`

##### `tm.simList(callback)`

#### Credit

##### `tm.credit(callback)`

## Errors
The client can manage almost every error generate by the API.
The typical error format is:
```javascript
{
    "type": "[network|parse|service]"
    "field": "detailed information"
}
```

**Network** and **parse** errors have another field `err` that contain a JavaScript error.

**Service** errors have other two fields:
* `code`: TM error code (when provided) or an HTTP status code (for example for 404 responses)
* `message`: a description about the occured error

## API docs
[In this document](docs/API.md) you can find a full description about the **methods** provided by the client, the **responses** of the API and a detailed description of the **errors** that can be generated.

### Over and out!