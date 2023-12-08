import json
import requests
from bs4 import BeautifulSoup

url = "https://3dpros.com/printer-categories/brand"

response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")
printers = {}

for e in soup.find_all("div", class_="printerEntry"):
    dimensions = [int(d) for d in e.find_all("div")[-3].text[:-3].split(' x ')]
    printers[e.find_all("a")[1].text] = { 'name' : e.find_all("a")[1].text, 'supportedFilament' : ['PLA', 'ABS', 'TPE'], 'dimensions': {'height' : dimensions[0], 'width' : dimensions[1], 'depth' : dimensions[2] }}


with open('presets.json', 'w') as f:
    f.write(json.dumps(printers))
