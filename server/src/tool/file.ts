import * as fs from 'fs';
import { join, resolve } from 'path';

export class File {
    protected folderValue: string;
    /**
     * Obtiene o estable la carpeta en donde está alojado el archivo. En caso de que éste exista, lo moverá de ubicación.
     */
    public get folder(): string {
        return this.folderValue;
    }
    public set folder(v: string) {
        // Format new Folder
        v = v.replace(/\\/gi, '/')
        if (!v.endsWith('/')) {
            v += '/';
        }

        if (v.match(/^(\.\/|\.\.\/)/gi) != null) {
            // Relative path
            if (this.folderValue == null) {
                v = resolve(v);
            } else {
                v = join(this.folderValue, v);
            }

            // Reformat
            v = v.replace(/\\/gi, '/')
        }
        
        const oldRef = {
            folder: this.folderValue,
            name: this.nameValue,
            ext: this.extValue
        };
        
        this.folderValue = v;
        this.move(oldRef.folder, oldRef.name, oldRef.ext);
    }

    protected nameValue: string;
    /**
     * Obtiene o establece el nombre del archivo. En caso de que el archivo exista, lo renombrará.
     */
    public get name(): string {
        return this.nameValue;
    }
    public set name(v: string) {
        // Find filename
        let match = v.match(/[^\\\/]+(?=\.[^\.\\\/]+$)/gi);
        if (match == null) {
            match = v.match(/[^\\\/]+$/gi);
        }

        if (match != null) {
            const oldRef = {
                folder: this.folderValue,
                name: this.nameValue,
                ext: this.extValue
            };
            
            this.nameValue = match[0];
            this.move(oldRef.folder, oldRef.name, oldRef.ext);
        }
    }

    protected extValue: string;
    public get ext(): string {
        return this.extValue;
    }
    public set ext(v: string) {
        const oldRef = {
            folder: this.folderValue,
            name: this.nameValue,
            ext: this.extValue
        };

        if (v != null) {
            let match = v.match(/[^\\\/\.]+$/gi);
            if (match != null) {
                this.extValue = match[0];
            }
        } else {
            this.extValue = null;
        }

        this.move(oldRef.folder, oldRef.name, oldRef.ext);
    }

    public get path(): string {
        if (
            (this.folderValue == null) ||
            (this.nameValue == null)
        ) {
            return null;
        } else {
            let out = this.folderValue;
            out += this.nameValue;
            if (this.extValue != null) {
                out += '.' + this.extValue;
            }
            
            return out;
        }
    }
    public set path(v: string) {
        v = v.replace(/\\/gi, '/');
        let folder = v.replace(/[^\/\\]+$/gi, '');
        let name = v.replace(new RegExp(`^${folder}`, 'gi'), '');
        
        const oldRef = {
            folder: this.folderValue,
            name: this.nameValue,
            ext: this.extValue
        };

        if (folder.match(/^(\.\/|\.\.\/)/gi) != null) {
            // Relative path
            if (this.folderValue == null) {
                folder = resolve(folder);
            } else {
                folder = join(this.folderValue, folder);
            }

        }
        
        // Reformat
        if (!folder.endsWith('/')) {
            folder += '/';
        }
        this.folderValue = folder.replace(/\\/gi, '/');
        this.nameValue = name.replace(/\.[^\\\/\.]+$/gi, '');
        this.extValue = name.replace(new RegExp(`^${this.nameValue}\.`, 'gi'), '');
        if (this.nameValue.startsWith(this.extValue)) {
            this.extValue = null
        }
        this.move(oldRef.folder, oldRef.name, oldRef.ext);
    }

    public get exist(): boolean {
        return fs.existsSync(this.path)
    }

    public constructor(path: string) {
        this.path = path;
    }
    
    private move(oldFolder: string, oldName: string, oldExt: string) {
        if (
            (this.folderValue == null) ||
            (this.nameValue == null) ||
            (oldFolder == null) ||
            (oldName == null)
        ) {
            return;
        } else if (
            (this.folderValue == oldFolder) &&
            (this.nameValue == oldName) &&
            (this.extValue == oldExt)
        ) {
            return;
        }

        // Replicar ruta antigua
        let oldPath = oldFolder + oldName
        if (oldExt != null) {
            oldPath += '.' + oldExt
        }

        // Comprobar existencia archivo actual
        if (!fs.existsSync(oldPath)) {
            this.folderValue = oldFolder;
            this.nameValue = oldName;
            this.extValue = oldExt;
            throw new Error(`Cannot move a file that doesn't exists.\nPath Origin -> "${oldPath}"`);
        }

        //Crear carpeta si es que no existe
        try {
            if (!fs.existsSync(this.folderValue)) {
                fs.mkdirSync(this.folderValue, { recursive: true });
            }
        } catch (err) {
            this.folderValue = oldFolder;
            this.nameValue = oldName;
            this.extValue = oldExt;
            throw new Error(
                    `Cannot create the folders recursively.\n`
                +   `Path Destin -> "${this.folderValue}"`
            )
        }

        //Copiar a Destino
        try {
            fs.copyFileSync(
                oldPath,
                this.path
            );
        } catch (err) {
            this.folderValue = oldFolder;
            this.nameValue = oldName;
            this.extValue = oldExt;
            throw new Error(
                    `Cannot copy the file inside the new folder.\n`
                +   `Path Origin -> "${oldPath}"\n`
                +   `Path Destin -> "${this.path}"`
            )
        }
    
        try {
            //Eliminar de origen
            fs.unlinkSync(
                oldPath
            );
        } catch (err) {
            this.folderValue = oldFolder;
            this.nameValue = oldName;
            this.extValue = oldExt;
            throw new Error(
                    `Cannot delete the original file.\n`
                +   `Path Origin -> "${oldPath}"`
            )
        }
    }

    public makeFolder() {
        if (!fs.existsSync(this.folderValue)) {
            fs.mkdirSync(this.folderValue, { recursive: true });
        }
    }

    public static makeFolder(path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    }

    public copy(path: string) {
        const file = new File(path);
        
        try {
            file.makeFolder();
        } catch (err) {
            throw new Error(
                    `Cannot create the folders recursively.\n`
                +   `Path Destin -> "${file.folder}"`
            )
        }

        try {
            fs.copyFileSync(
                this.path,
                file.path
            );
        } catch (err) {
            throw new Error(
                    `Cannot copy the file inside the new folder.\n`
                +   `Path Origin -> "${this.path}"\n`
                +   `Path Destin -> "${file.path}"`
            )
        }
    }

    public delete() {
        if (!this.exist) {
            throw new Error(
                    `Cannot delete a file that doesn't exists.\n`
                +   `Path Origin -> "${this.path}"`
            )
        }

        try {
            fs.unlinkSync(this.path)
        } catch (err) {
            throw new Error(
                    `Cannot delete the original file.\n`
                +   `Path Origin -> "${this.path}"`
            )
        }
    }

    public read() {
        return new Promise<Buffer>((resolve, reject) => {
            if (!this.exist) {
                reject(new Error(
                        `Cannot read a file that doesn't exists.\n`
                    +   `Path -> "${this.exist}"`
                ));
            }

            fs.readFile(this.path, (fail, data) => {
                if (fail != null) {
                    reject(new Error(
                            `Cannot read the file, probably it's corrupted or requires elevated privileges.\n`
                        +   `Path -> "${this.exist}"`
                    ))
                } else {
                    resolve(data)
                }
            })
        })
    }

    public readSync() {
        if (!this.exist) {
            throw new Error(
                    `Cannot read a file that doesn't exists.\n`
                +   `Path -> "${this.exist}"`
            );
        }

        try {
            return fs.readFileSync(this.path)
        } catch {
            throw new Error(
                    `Cannot read the file, probably it's corrupted or requires elevated privileges.\n`
                +   `Path -> "${this.exist}"`
            );
        }
    }

    public readText() {
        return new Promise<string>((resolve, reject) => {
            if (!this.exist) {
                reject(new Error(
                        `Cannot read a file that doesn't exists.\n`
                    +   `Path -> "${this.exist}"`
                ));
            }

            fs.readFile(this.path, (fail, data) => {
                if (fail != null) {
                    reject(new Error(
                            `Cannot read the file, probably it's corrupted or requires elevated privileges.\n`
                        +   `Path -> "${this.path}"`
                    ))
                } else {
                    resolve(data.toString("utf8"))
                }
            })
        })
    }

    public readTextSync() {
        if (!this.exist) {
            throw new Error(
                    `Cannot read a file that doesn't exists.\n`
                +   `Path -> "${this.exist}"`
            );
        }

        try {
            return fs.readFileSync(this.path).toString("utf8");
        } catch {
            throw new Error(
                    `Cannot read the file, probably it's corrupted or requires elevated privileges.\n`
                +   `Path -> "${this.path}"`
            );
        }
    }

    public write(data: Buffer){
        return new Promise<void>((resolve, reject) => {
            this.makeFolder()
            fs.writeFile(this.path, data, fail => {
                if (fail != null) {
                    reject(new Error(
                            `Cannot write in the file, probably it's corrupted or requires elevated privileges.\n`
                        +   `Path -> "${this.path}"`
                    ));
                } else {
                    resolve();
                }
            })
        })
    }

    public writeSync(data: Buffer) {
        try {
            this.makeFolder();
            fs.writeFileSync(this.path, data);
        } catch (err) {
            throw new Error(
                    `Cannot write in the file, probably it's corrupted or requires elevated privileges.\n`
                +   `Path -> "${this.path}"`
            )
        }
    }

    public writeText(data: string){
        return new Promise<void>((resolve, reject) => {
            this.makeFolder()
            fs.writeFile(this.path, data, { encoding: "utf8" }, fail => {
                if (fail != null) {
                    reject(new Error(
                            `Cannot write in the file, probably it's corrupted or requires elevated privileges.\n`
                        +   `Path -> "${this.path}"`
                    ))
                } else {
                    resolve()
                }
            })
        })
    }

    public writeTextSync(data: string) {
        try {
            this.makeFolder()
            fs.writeFileSync(this.path, data, { encoding: "utf8" })
        } catch {
            throw new Error(
                    `Cannot write in the file, probably it's corrupted or requires elevated privileges.\n`
                +   `Path -> "${this.path}"`
            )
        }
    }
}