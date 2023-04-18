import { RDM_Device } from "./RDM_Device";

type FilterMode = 'none' | 'na' | 'tmb';
type SortMode = 'uid' | 'address' | 'manufacturer';

export class DynamicList {
    protected devices: RDM_Device[];
    private filteredDevices: RDM_Device[];
    private filterMode: FilterMode;
    private sortMode: SortMode;

    constructor(private _title: HTMLElement, private _root: HTMLElement) {
        this.devices = [];
        this.filteredDevices = [];
        this.filterMode = 'none';
        this.sortMode = 'uid';
    }

    public addDevice(device: RDM_Device): void {
        this.devices.push(device);
        this.applyFilter();
        this.applySort();
        this.updateTable();
        this.updateTitle();
    }

    public updateDevice(device: RDM_Device): void {
        const index = this.devices.findIndex(d => d.uid === device.uid);

        if (index !== -1) {
            this.devices[index] = device;

            const filteredIndex = this.filteredDevices.findIndex(d => d.uid === device.uid);
            if (filteredIndex !== -1) {
                this.filteredDevices[filteredIndex] = device;
            }

            this.updateTable();
        }
    }

    public setFilterMode(mode: FilterMode): void {
        this.filterMode = mode;
        this.applyFilter();
        this.updateTable();
        this.updateTitle();
    }

    public setSortMode(mode: SortMode): void {
        this.sortMode = mode;
        this.applySort();
        this.updateTable();
        this.updateTitle();
    }

    private applyFilter(): void {
        if (this.filterMode === 'none') {
            this.filteredDevices = [...this.devices];
        } else {
            this.filteredDevices = this.devices.filter(device => device.manufacturer === (this.filterMode === 'na' ? 'Company NA' : 'TMB'));
        }
    }

    private applySort(): void {
        this.filteredDevices.sort((a, b) => {
            switch (this.sortMode) {
                case 'uid':
                    return a.uid_integer < b.uid_integer ? -1 : (a.uid_integer > b.uid_integer ? 1 : 0);
                case 'address':
                    return a.address - b.address;
                case 'manufacturer':
                    return a.manufacturer.localeCompare(b.manufacturer);
                default:
                    return 0;
            }
        });
    }

    private createTableRow(device: RDM_Device): HTMLElement {
        const row = document.createElement("tr");

        const onlineStatusCell = document.createElement("td");
        const uidCell = document.createElement("td");
        const labelCell = document.createElement("td");
        const manufacturerCell = document.createElement("td");
        const modelCell = document.createElement("td");
        const modeIndexCell = document.createElement("td");
        const addressCell = document.createElement("td");

        onlineStatusCell.classList.add("online-status");
        onlineStatusCell.classList.add(device.is_online ? "is_online" : "is_offline");
        uidCell.textContent = device.uid;
        labelCell.textContent = device.label;
        manufacturerCell.textContent = device.manufacturer;
        modelCell.textContent = device.model;
        modeIndexCell.textContent = String(device.mode_index);
        addressCell.textContent = String(device.address);

        row.appendChild(onlineStatusCell);
        row.appendChild(uidCell);
        row.appendChild(labelCell);
        row.appendChild(manufacturerCell);
        row.appendChild(modelCell);
        row.appendChild(modeIndexCell);
        row.appendChild(addressCell);

        return row;
    }


    private updateTable(): void {
        const rowsToRemove = this._root.querySelectorAll("tr:not(:first-child)");
        rowsToRemove.forEach(row => this._root.removeChild(row));

        for (const device of this.filteredDevices) {
            const row = this.createTableRow(device);
            this._root.appendChild(row);
        }
    }

    private updateTitle(): void {
        this._title.textContent = `RDM Device List (${this.devices.length}/${this.filteredDevices.length} devices | ${this.filterMode} | ${this.sortMode})`;
    }
}
