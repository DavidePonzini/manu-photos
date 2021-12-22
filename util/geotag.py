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
        exiftool_execute(et, '-GPSLatitudeRef=N', file)
        exiftool_execute(et, '-GPSLatitude={}'.format(lat), file)
        
        exiftool_execute(et, '-GPSLongitudeRef=E', file)
        exiftool_execute(et, '-GPSLongitude={}'.format(lng), file)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('lat', type=float, help="Latitude coordinates")
    parser.add_argument('lng', type=float, help="Longitude coordinates")
    parser.add_argument('files', type=str, nargs='+', help="Files to apply the coordinates to")
    
    args = parser.parse_args()

    for file in args.files:
        write_gps_coords('./exiftool(-k).exe', file, args.lat, args.lng)
        print(file)