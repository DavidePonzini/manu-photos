'''
Geotagging utility written by Davide Ponzini
* Install requirements with: `pip3 install -r requirements.txt`
* Run from command line with `python3 geotag.py <lat> <lng> <files...>

Notes: must be run from this directory!
18/12/2021
'''

import exiftool
import argparse


def exiftool_execute(exiftool, command: str, file: str):
    exiftool.execute(command.encode(), file.encode())


def write_gps_coords(executable, file, lat, lng):
    with exiftool.ExifTool(executable) as et:
        exiftool_execute(et, '-GPSLongitude={}'.format(lng), file)
        exiftool_execute(et, '-GPSLatitude={}'.format(lat), file)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('lat', type=float)
    parser.add_argument('lng', type=float)
    parser.add_argument('files', type=str, nargs='+')
    
    args = parser.parse_args()

    for file in args.files:
        write_gps_coords('./exiftool(-k).exe', file, args.lat, args.lng)
        print(file)