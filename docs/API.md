# ThingsMobile API
Currently this module provides 6 API to manage you SIMs and credit.
In this document are described the **methods** provided by the client, the **responses** to every API and the **errors** generated by the client.

Here it is the list of supported API:
* [activateSim](#activatesim)
* [blockSim](#blocksim)
* [unblockSim](#unblocksim)
* [simStatus](#simstatus)
* [simList](#simlist)
* [credit](#credit)

## API Responses

#### activateSim
This API allows you to activate a new SIM to let you use it in your project.
The parameters requested are the `MSISDN`of the SIM and its `barcode` that can be found on the card sold with the SIM.
##### `tm.activateSim(msisdn, simBarcode, callback)`

Success message:
```javascript
{
    "done": true,
    "message": "SIM activated"
}
```

#### blockSim
With this method you can block a SIM that has been already activated.
The only parameter requested is the `MSISDN` of the SIM.

##### `tm.blockSim(msisdn, callback)`

Success message:
```javascript
{
    "done": true,
    "message": "SIM blocked"
}
```

#### unblockSim
With this method you can unblock a SIM that has been previously blocked.
The only parameter requested is the `MSISDN` of the SIM.

##### `tm.unblockSim(msisdn, callback)`

Success message:
```javascript
{
    "done": true,
    "message": "SIM unblocked"
}
```

#### simStatus
With this API you can get information about a specific SIM. The parameter is the `MSISDN` of the SIM.
The API returns a lot of details such as the `name` of the SIM, the current `status`, `lastConnection` (last time the SIM connected to a cell tower), details on the `traffic` consumed and a list with all `cdrs` associated to the SIM.

##### `tm.simStatus(msisdn, callback)`

Success message:
```javascript
{
    "name": "sim name",
    "tag": "sim-tag",
    "msisdn": "xxxxxxxxxxxxxxx",
    "iccid": "xxxxxxxxxxxxxxxxxxx",
    "status": "active",
    "type": "sim type",
    "lastConnection": "2018-02-20T20:40:01.000Z",
    "plan": {
        "type": "default",
        "activation": "2017-12-05T09:04:03.000Z",
        "expiration": null
    },
    "balance": 123456,
    "traffic": {
        "daily": 123,
        "monthly": 1234,
        "total": 12345
    },
    "threshold": {
        "daily": 1000000.0,
        "monthly": 2000000.0,
        "total": 3000000.0
    },
    "blockSim": {
        "daily": 1,
        "monthly": 1,
        "total": 1,
        "afterExpiration": 1
    },
    "cdrs": [
        {
            "start": "2018-02-20T17:01:21.000Z",
            "stop": "2018-02-20T20:40:01.000Z",
            "traffic": 10,
            "country": "Italy",
            "imsi": "xxxxxxxxxxxxxxx",
            "network": "Zone 1",
            "operator": "Operator"
        }
    ]
}
```

#### simList
This method returns the information about all SIM associated with the user account.
No parameters are required.

##### `tm.simList(callback)`

Success message:
```javascript
[
    {
        "name": "sim name",
        "tag": "sim-tag",
        "msisdn": "xxxxxxxxxxxxxxx",
        "iccid": "xxxxxxxxxxxxxxxxxxx",
        "status": "active",
        "type": "sim type",
        "lastConnection": "2018-02-20T20:40:01.000Z",
        "plan": {
            "type": "default",
            "activation": "2017-12-05T09:04:03.000Z",
            "expiration": null
        },
        "balance": 123456,
        "traffic": {
            "monthly": 1234
        }
    }
]
```


#### credit
This API returns the `history` of the transactions made on the user's account and the current `amount` of money.

##### `tm.credit(callback)`

Success message:
```javascript
{
    "amount": 8.8,
    "currency": "EUR",
    "history": [
        {
            "amount": -0.1,
            "date": "2018-02-04T00:00:00.000Z",
            "description": "Recharge",
            "msisdn": "xxxxxxxxxxxxxxx"
        }
    ]
}
```

## Errors
There are three types of errors that can be generated by the client: **network**, **parse** and **service** error.

#### Network and parse errors
These two errors have a similar structure with a `type` field indicating what generated the error and another field `err` with a JavaScript error that describe the problem occured.

```javascript
{
    "type": "[network|parse]"
    "err": "JavaScript error"
}
```

#### Service errors
Service errors have a different format with a field `code` that store the error code and another field `message` with a short description about the problem.

```javascript
{
    "type": "service"
    "code": "error code",
    "message": "error message"
}
```
There are **7** error codes:

| Code | Message               | Description                                                 |
|------|-----------------------|-------------------------------------------------------------|
| 0    | -                     | TM API returned an undefined response (e.g. inexistent SIM) |
| 10   | generic error         | there is a problem on TM server                             |
| 20   | input error           | an input passed to the API is invalid                       |
| 30   | user error            | user has inserted invalid credentials (e.g. invalid token)  |
| 40   | sim error             | problem with the requested SIM (e.g. SIM not found)         |
| 404  | resource not found    | the requested resource does not exist                       |
| 500  | internal server error | there is an internal error on TM server                     |

These are some examples of errors returned by the client:

```javascript
// generic error while blocking a SIM
{
    type: 'service',
    code: '10',
    message: 'generic error: error blocking sim'
}

// user inserted an invalid simBarcode while activating a SIM
{
    type: 'service',
    code: '20',
    message: 'input error: simBarcode'
}

// user provided an invalid token
{
    type: 'service',
    code: '30',
    message: 'user error: token mismatch'
}
```