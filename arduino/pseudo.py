door_open = False
door_unlocked = False
door_unlocked_ticks = 0 # * 10 ms = 10 seconds
scan_base_weight = 0
storage_base_weight = 0

def start_session():
    door_unlocked_ticks = 1000 # * 10 ms = 10 seconds
    door_unlocked = handle_door(True)
    handle_session()
    
    
def get_storage_weight():
    pass # TODO: return measured weight in the storage compartment, in grams


def get_scan_weight():
    pass # TODO: return measured weight in the storage compartment, in grams
    
    
def update_weight(new_storage_base_weight, new_scan_base_weight):
    scan_base_weight=new_scan_base_weight
    storage_base_weight=new_storage_base_weight
    
    
def handle_door(open):
    return open # TODO: unlock the door if open = True, otherwise close
    

def check_open():
    if not_open and door_unlocked: # type: ignore
        handle_door(False)
    if open and not door_open: # door is changing state from closed to open
        # TODO: Notify backend "box/notify_open?box_id=1"
        pass
    if not open and door_open: # door is changing state from open to closed
        # TODO: Notify backend "box/notify_closed?box_id=1"
        pass
    return True # TODO: check if Reed switch is open, returns True if door is open, otherwise False


def handle_session():
    
    storage_weight_change = 0
    storage_weight_countdown = 5 # minimum number of unchanged 10 ms periods
    
    scan_weight_change = 0
    scan_weight_countdown = 5 # minimum number of unchanged 10 ms periods
    
    while door_open or door_unlocked:
        sleep(10) # type: ignore // sleeps for 10 ms
        door_open = check_open()
        
        # Door automatically locks again after 
        door_unlocked_ticks -= 1
        if door_unlocked_ticks <= 0:
            door_unlocked = handle_door(False)
            
        current_storage_weight = get_storage_weight()
        if storage_weight_change == current_storage_weight:
            storage_weight_countdown -= 1
        else:
            storage_weight_change = current_storage_weight
            storage_weight_countdown = 5 # reset the min number of unchanged periods
            
        if storage_weight_countdown == 0:
            # TODO: notify frontend about storage weight change: storage_weight_change?box_id=1&weight_change=storage_weight_change
            pass
            
            
        # Same thing for scan compartment:
        current_scan_weight = get_scan_weight()
        if scan_weight_change == current_scan_weight:
            scan_weight_countdown -= 1
        else:
            scan_weight_change = current_scan_weight
            scan_weight_countdown = 5 # reset the min number of unchanged periods
            
        if scan_weight_countdown == 0:
            # TODO: notify frontend about scan weight change: scan_weight_change?box_id=1&weight_change=scan_weight_change
            pass