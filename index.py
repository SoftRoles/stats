import psutil
import json
from datetime import datetime
import time

psutil.cpu_times()

while True:
    cpuPercent = 100.0 - \
        float(str(psutil.cpu_times_percent(interval=1.0).idle))
    memPercent = psutil.virtual_memory().percent
    message = {
        'cpu': cpuPercent,
        'mem': memPercent,
        'disks': [],
        'users': []
    }
    for partition in psutil.disk_partitions():
        try:
            message['disks'].append(
                {'drive': partition.device, 'usage': psutil.disk_usage(partition.device).percent})
        except:
            pass

    for user in psutil.users():
        now = datetime.timestamp(datetime.now())
        userLogon = user.started
        passed = now - userLogon
        message['users'].append(
            {'name': user.name, 'logon': datetime.fromtimestamp(passed).strftime("%H:%M:%S")})
    print(str(json.dumps(message)), flush=True)
