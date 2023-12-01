import requests
import json
import logging
import os
import argparse

parser = argparse.ArgumentParser(
                    prog='Sample Data Generator',
                    description='Creates sample data for Voxeti',
                    epilog='Created by Nate Sawant')

parser.add_argument('--level', choices=['info', 'debug'], default='info')

args = parser.parse_args()

levels = {
  'info' : logging.INFO,
  'debug' : logging.DEBUG
}

logger = logging.Logger("Data generator")

logger.addHandler(logging.StreamHandler())
logger.setLevel(levels.get(args.level, logging.INFO))


url = "http://localhost:3000/api/users"

payload = json.dumps({
  "firstName": "Nate",
  "lastName": "Sawant",
  "email": "natesawant@gmail.com",
  "password": "password",
  "socialProvider": "NONE",
  "addresses": [
    {
      "name": "Primary",
      "line1": "820 Parker Street",
      "line2": "Apt 1",
      "zipCode": "02120",
      "city": "Boston",
      "state": "MA",
      "country": "United States",
      "location": {
        "type": "Point",
        "coordinates": [
          -71.0991585,
          42.3278301
        ]
      }
    }
  ],
  "phoneNumber": {
    "countryCode": "1",
    "number": "6094338636"
  },
  "experience": 3
})
headers = {
  'Cookie': 'test; voxeti-session=MTcwMTMyMTIzMHxEWDhFQVFMX2dBQUJFQUVRQUFEX2dfLUFBQUlHYzNSeWFXNW5EQXNBQ1dOemNtWlViMnRsYmdaemRISnBibWNNTGdBc2RYZHhORlZ6VW1ndFQzSkthR1ZZTkZrNVdGOUVSRE5qUkV4bmNFOVVSbXh0V0dSUlJFUlNVa2Q0VVQwR2MzUnlhVzVuREFnQUJuVnpaWEpKWkFaemRISnBibWNNR2dBWU5qVTJPREZoTUdFeU9HTTNPR05pTkdOaE5Ua3laR00yfNUCX3fsx59GvhjteeRkXcj7nJUMgoVb6CCyu1jTTHU8',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
logger.info(response.status_code)

logger.debug(response.text)

url = "http://localhost:3000/api/auth/login"

payload = json.dumps({
  "email": "natesawant@gmail.com",
  "password": "password"
})
headers = {
  'Cookie': 'test; voxeti-session=MTcwMTMyMTM3OXxEWDhFQVFMX2dBQUJFQUVRQUFEX2dfLUFBQUlHYzNSeWFXNW5EQXNBQ1dOemNtWlViMnRsYmdaemRISnBibWNNTGdBc1dFOVZWQzE2VDJodFJqbG9ZVGRDYVVaTE1HOVhSek52YUdoRGRWUmpNblJHU2xScWNtWk5iM2N4VVQwR2MzUnlhVzVuREFnQUJuVnpaWEpKWkFaemRISnBibWNNR2dBWU5qVTJPREZoT1dOaU5qUTBaVFppTURoaE1ESTFNRGc1fKPYDO_zsb9aH3-wAaKyC5yJMGfB1ADVFoXHAi6N7j0j',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

logger.debug(response.json())

designerId = response.json()['user']['id']
token = response.json()['csrfToken']
cookie = response.headers['Set-Cookie']

logger.info(response.status_code)

logger.debug(response.text)

url = "http://localhost:3000/api/slicer/"

payload = json.dumps({
  "shipping": True,
  "filamentType": "PLA",
  "slices": [
    {
      "file": "voxeti-65650d571d808cc0551da463.stl",
      "flavor": "Marlin",
      "time": 6092,
      "filamentused": 6.16894,
      "layerheight": 0.2,
      "minx": 92.052,
      "miny": 91.423,
      "minz": 0.3,
      "maxx": 143.78,
      "maxy": 143.575,
      "maxz": 61.9,
      "targetmachinename": "Creality Ender-3",
      "quantity": 1
    }
  ]
})
headers = {
  'Csrftoken': token,
  'Cookie': cookie,
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
logger.info(response.status_code)

logger.debug(response.text)

url = "http://localhost:3000/api/designs"

payload = {'dimensions': '{"height":52.15199999999999, "width":51.727999999999994, "depth":61.6}'}
files=[
  ('files',('adt.stl',open(os.path.join(os.path.dirname(__file__), 'files/adt.stl'),'rb'),'application/octet-stream'))
]
headers = {
  'Csrftoken': token,
  'Cookie': cookie
}

response = requests.request("POST", url, headers=headers, data=payload, files=files)

designId = response.json()[0]['id']

logger.info(response.status_code)

logger.debug(response.text)

url = "http://localhost:3000/api/jobs"

payload = json.dumps({
  "createdAt": "2023-11-30T04:54:18.643Z",
  "designerId": designerId,
  "designId": [
    designId
  ],
  "quantity": [
    1
  ],
  "status": "PENDING",
  "price": 10123,
  "shipping": 10000,
  "taxes": 123,
  "color": "White",
  "filament": "PLA",
  "layerHeight": 0.2,
  "shippingAddress": {
    "name": "Primary",
    "line1": "820 Parker Street",
    "line2": "Apt 1",
    "zipCode": "02120",
    "city": "Boston",
    "state": "MA",
    "country": "United States",
    "location": {
      "type": "Point",
      "coordinates": [
        -71.0991585,
        42.3278301
      ]
    }
  }
})
headers = {
  'Csrftoken': token,
  'Cookie': cookie,
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
logger.info(response.status_code)

logger.debug(response.text)
