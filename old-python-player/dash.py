import socket
import struct
import binascii
import time
import json
import urllib2
import sys, os, random

mac_add = 'aabbccddeeffgg'

def button_pressed():
    print("She works!")
    dir_list = os.listdir("/media/pi/PATRIOT/")
    rand_file = "/media/pi/PATRIOT/"+str(dir_list[random.randint(0,len(dir_list))])
    rand_file = rand_file.replace("'","\'")
    print(rand_file)
    os.system('omxplayer "'+rand_file+'"')

rawSocket = socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.htons(0x0003))


while True:
    packet = rawSocket.recvfrom(2048)
    ethernet_header = packet[0][0:14]
    ethernet_detailed = struct.unpack("!6s6s2s",ethernet_header)
    ethertype = ethernet_detailed[2]
    if ethertype != '\x08\x06':
        continue
    arp_header = packet[0][14:42]
    arp_detailed = struct.unpack("2s2s1s1s2s6s4s6s4s", arp_header)
    source_mac = binascii.hexlify(arp_detailed[5])
    source_ip = socket.inet_ntoa(arp_detailed[6])
    dest_ip = socket.inet_ntoa(arp_detailed[8])
    if mac_add.lower() == source_mac.lower():
        button_pressed()
    else:
        print("Unknown Mac", source_mac)
