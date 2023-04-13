import { DynamicList } from "./DynamicList";
import { RDM_Device } from "./RDM_Device";
import { Server } from "./Server";

window.onload = () => {
    main();
};

let g_Server;
let g_DeviceList: DynamicList;

function main() {
    g_Server = new Server({
        device_added_callback: (device_data) => {
            g_DeviceList.addDevice(device_data);
        },
        device_updated_callback: (device_data) => {
            g_DeviceList.updateDevice(device_data);
        },
    });

    console.log("Current Device Count: ", g_Server.GetDeviceCount());
    console.log("First Device: ", g_Server.GetDeviceByIndex(0));

    document.getElementById("filter_none").onclick = () => {
        g_DeviceList.setFilterMode('none');
    };

    document.getElementById("filter_na").onclick = () => {
        g_DeviceList.setFilterMode('na');
    };

    document.getElementById("filter_tmb").onclick = () => {
        g_DeviceList.setFilterMode('tmb');
    };

    document.getElementById("sort_uid").onclick = () => {
        g_DeviceList.setSortMode('uid');
    };

    document.getElementById("sort_address").onclick = () => {
        g_DeviceList.setSortMode('address');
    };

    document.getElementById("sort_manufacturer").onclick = () => {
        g_DeviceList.setSortMode('manufacturer');
    };

    const titleElement = document.querySelector("#list_frame > span") as HTMLElement;
    const tableRoot = document.querySelector("#rdm_device_list > table > tbody") as HTMLElement;
    g_DeviceList = new DynamicList(titleElement, tableRoot);
}
