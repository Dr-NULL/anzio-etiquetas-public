import {MigrationInterface, QueryRunner} from "typeorm";

export class NewDB1593526028046 implements MigrationInterface {
    name = 'NewDB1593526028046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Familia" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL CONSTRAINT "DF_7d93bd0745af7255751a1482701" DEFAULT 1, "codigo" varchar(2) NOT NULL, "descripc" varchar(50) NOT NULL, CONSTRAINT "PK_af44f811085cc2476ddc62fb904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Language" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL CONSTRAINT "DF_051bc30524ab4829d410b70ee06" DEFAULT 1, "default" bit NOT NULL CONSTRAINT "DF_4b02c9e957cab19e54873616cea" DEFAULT 0, "codigo" varchar(10) NOT NULL, "descripc" varchar(50) NOT NULL, CONSTRAINT "PK_5abd0de610ce0c31b727f5547ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ProductoDet" ("id" int NOT NULL IDENTITY(1,1), "descripc" nvarchar(256) NOT NULL, "languageId" int, "productoId" int, CONSTRAINT "PK_fccd0686fe9c1fd3dfaeb4cdab6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Producto" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL CONSTRAINT "DF_7a92c88fad5f0d956654d17930f" DEFAULT 1, "codigo" varchar(14) NOT NULL, "familiaId" int, CONSTRAINT "UQ_8aaae30e2e9c5d7fac2e891932d" UNIQUE ("codigo"), CONSTRAINT "PK_e7929944b382b76708c4881fbde" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Pais" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL CONSTRAINT "DF_a96c374fa80114a0f80677e6ef0" DEFAULT 1, "codigo" varchar(3) NOT NULL, "descripc" varchar(50) NOT NULL, CONSTRAINT "PK_39588447e7618c9343867dd9ffc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Fuente" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL CONSTRAINT "DF_8f22e6a3a918422495e27de4491" DEFAULT 1, "nombre" varchar(64) NOT NULL, "fontFace" varchar(64) NOT NULL, "filename" varchar(512) NOT NULL, CONSTRAINT "PK_6c7460239eee35598b7699cfe1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "FormatoText" ("id" int NOT NULL IDENTITY(1,1), "x" float NOT NULL, "y" float NOT NULL, "width" float NOT NULL, "height" float NOT NULL, "angle" float NOT NULL CONSTRAINT "DF_ccfc3729833e288a5fe37b8f37b" DEFAULT 0, "text" nvarchar(1024) NOT NULL, "align" varchar(255) NOT NULL CONSTRAINT "DF_363ec425f083ea92b16e17caf4f" DEFAULT 'left', "baseline" varchar(50) NOT NULL CONSTRAINT "DF_2099fed018ab991340a4204ac42" DEFAULT 'top', "fontSize" float NOT NULL CONSTRAINT "DF_12c29e8445046c3652cdaf0911a" DEFAULT 10, "printOriginal" bit NOT NULL CONSTRAINT "DF_db81846713e5b0128312b4cab63" DEFAULT 1, "printCopy" bit NOT NULL CONSTRAINT "DF_ad145e5b4f69b02b2f5c76f2f33" DEFAULT 1, "formatoId" int, "fuenteId" int, CONSTRAINT "PK_e35716f13b8b9c1d1267eafc650" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "FormatoRect" ("id" int NOT NULL IDENTITY(1,1), "x" float NOT NULL, "y" float NOT NULL, "width" float NOT NULL, "height" float NOT NULL, "lineWidth" float NOT NULL CONSTRAINT "DF_f5f7063be5eee5432e253c63b78" DEFAULT 0.5, "cornerRadius" float NOT NULL CONSTRAINT "DF_2bea00bdb40d8cacb2640a5bf70" DEFAULT 0, "color" varchar(7) NOT NULL CONSTRAINT "DF_ce0f8cb26d4f4f09a442c7f693b" DEFAULT '#000000', "formatoId" int, CONSTRAINT "PK_dfb5e5f7c67b29025b13f83a39e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Picture" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL CONSTRAINT "DF_58005c26b288b60757eda570658" DEFAULT 1, "nombre" varchar(200) NOT NULL, "descripc" varchar(1024) NOT NULL, "ext" varchar(5) NOT NULL, "width" int NOT NULL, "height" int NOT NULL, CONSTRAINT "PK_dd467e046affee63d20efad7685" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "FormatoPict" ("id" int NOT NULL IDENTITY(1,1), "x" int, "y" int, "width" int, "height" int, "formatoId" int, "pictureId" int, CONSTRAINT "PK_bf3923a938b9e2e8af0e27419e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Printer" ("id" bigint NOT NULL IDENTITY(1,1), "name" varchar(100) NOT NULL, "formatoId" int, CONSTRAINT "PK_92754577fc8f64672ca00170f1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UsuarioQueue" ("id" bigint NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_2099eb482709a753c2dc7ca9649" DEFAULT CURRENT_TIMESTAMP, "user" varchar(20) NOT NULL, "mail" varchar(256) NOT NULL, "token" varchar(256) NOT NULL, "creatorId" int, "usuarioTipoId" int, CONSTRAINT "PK_0cba374450ea8d1e1b9d478d326" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Usuario" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL CONSTRAINT "DF_24c7df5582a4e4b2d3b200c6e4d" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_ceafdbd20fcf354ee4b6065e37b" DEFAULT CURRENT_TIMESTAMP, "rut" varchar(12) NOT NULL, "nombres" varchar(100) NOT NULL, "apellidoP" varchar(100) NOT NULL, "apellidoM" varchar(100), "user" varchar(20) NOT NULL, "pass" varchar(1024) NOT NULL, "mail" varchar(100) NOT NULL, "usuarioTipoId" int, CONSTRAINT "PK_925c3fc5494373e254405c000eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UsuarioTipo" ("id" int NOT NULL IDENTITY(1,1), "rango" tinyint NOT NULL, "nombre" varchar(255) NOT NULL, "descripc" varchar(255) NOT NULL, CONSTRAINT "PK_4170b0c21c0fa0f9d4b95fec05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UsuarioTipoMenu" ("id" int NOT NULL IDENTITY(1,1), "usuarioTipoId" int, "menuId" int, CONSTRAINT "PK_47ec92f80d7526bb9f1291c0a9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Menu" ("id" int NOT NULL IDENTITY(1,1), "everyone" bit NOT NULL CONSTRAINT "DF_9e37c17a43e26a803e665d13e6f" DEFAULT 0, "hidden" bit NOT NULL CONSTRAINT "DF_49ca65d7f06fd0e7a8ddaf01e18" DEFAULT 0, "hideOnLogged" bit NOT NULL CONSTRAINT "DF_ad1d349b528a5ed4ae269ad6d37" DEFAULT 0, "icon" varchar(50) NOT NULL, "text" varchar(100) NOT NULL, "path" varchar(500), "mpath" varchar(255) CONSTRAINT "DF_ce23145c2ec228a128ffb3c28db" DEFAULT '', "parentId" int, CONSTRAINT "PK_b2683c330c5e6d700266a6f46d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Formato" ("id" int NOT NULL IDENTITY(1,1), "codigo" varchar(10) NOT NULL, "descripc" varchar(100) NOT NULL, "width" int NOT NULL, "height" int NOT NULL, "isActive" bit NOT NULL CONSTRAINT "DF_3202de8df75da4b73d81f870f74" DEFAULT 1, CONSTRAINT "UQ_0069fbd3dc048adf9a321e0d520" UNIQUE ("codigo"), CONSTRAINT "PK_af5db49f1a023e894c37ecc27e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "FormatoConfig" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL CONSTRAINT "DF_e25ec03d6ed422a65f4b9dc48e3" DEFAULT 1, "productoId" int, "paisId" int, "formatoId" int, CONSTRAINT "PK_d208ce80e3fdd9cab0acff2f76a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Etiqueta" ("id" int NOT NULL IDENTITY(1,1), "copyOf" int, "barcode" varchar(20), "codAnimal" varchar(20), "pesoBruto" numeric(5,2) NOT NULL, "pesoNeto" numeric(5,2) NOT NULL, "fechaImpres" datetime NOT NULL CONSTRAINT "DF_6893a40a43e44a206c9abc909a9" DEFAULT CURRENT_TIMESTAMP, "fechaFaena" datetime NOT NULL, "fechaProducc" date NOT NULL, "fechaVencim" date NOT NULL, "loteRecepc" bigint, "loteCertif" bigint NOT NULL, "contrato" bigint NOT NULL, "productoId" int, "paisId" int, CONSTRAINT "PK_7d14803bac8dec8e4ecf0ce0295" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ProductoDet" ADD CONSTRAINT "FK_a48a7f32e9cbbbef9310ca976ae" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProductoDet" ADD CONSTRAINT "FK_cc127ec96a6b1293c5f1dced6cc" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Producto" ADD CONSTRAINT "FK_507854f761f4a632ae924ebf3bd" FOREIGN KEY ("familiaId") REFERENCES "Familia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FormatoText" ADD CONSTRAINT "FK_7a1d5e987bb4acd463c475eb6b8" FOREIGN KEY ("formatoId") REFERENCES "Formato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FormatoText" ADD CONSTRAINT "FK_bfcdc1303a1869e43c7a8ce232a" FOREIGN KEY ("fuenteId") REFERENCES "Fuente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FormatoRect" ADD CONSTRAINT "FK_e2b07feaa831d8cd15245a8f0e4" FOREIGN KEY ("formatoId") REFERENCES "Formato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FormatoPict" ADD CONSTRAINT "FK_427bbaf86e32da9d0f85e1af587" FOREIGN KEY ("formatoId") REFERENCES "Formato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FormatoPict" ADD CONSTRAINT "FK_baa8bac44eac365e7e48d000048" FOREIGN KEY ("pictureId") REFERENCES "Picture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Printer" ADD CONSTRAINT "FK_beb9563a210880e7f760ccc90d3" FOREIGN KEY ("formatoId") REFERENCES "Formato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UsuarioQueue" ADD CONSTRAINT "FK_a4ac8d9b685e8450ded72fcab4f" FOREIGN KEY ("creatorId") REFERENCES "Usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UsuarioQueue" ADD CONSTRAINT "FK_cefdd40723688b47b2a2fd72f8f" FOREIGN KEY ("usuarioTipoId") REFERENCES "UsuarioTipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Usuario" ADD CONSTRAINT "FK_0f585a4fc23d6070f14a2747223" FOREIGN KEY ("usuarioTipoId") REFERENCES "UsuarioTipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UsuarioTipoMenu" ADD CONSTRAINT "FK_67c44f92227b9aafc3dff4e4dc9" FOREIGN KEY ("usuarioTipoId") REFERENCES "UsuarioTipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UsuarioTipoMenu" ADD CONSTRAINT "FK_bc70a410a2c29f58b625c5ca2dd" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Menu" ADD CONSTRAINT "FK_c4c5fa3bc158c089f076ec35d08" FOREIGN KEY ("parentId") REFERENCES "Menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FormatoConfig" ADD CONSTRAINT "FK_e28195487f7704f4ffbb823783b" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FormatoConfig" ADD CONSTRAINT "FK_529f124baf9d4f75509439ca613" FOREIGN KEY ("paisId") REFERENCES "Pais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FormatoConfig" ADD CONSTRAINT "FK_a0ab4c0a1aad34724a2879406d4" FOREIGN KEY ("formatoId") REFERENCES "Formato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Etiqueta" ADD CONSTRAINT "FK_1803393a1af0e520fd97386fa25" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Etiqueta" ADD CONSTRAINT "FK_ab9e737a904f4b09ea0ed9ed10b" FOREIGN KEY ("paisId") REFERENCES "Pais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Etiqueta" DROP CONSTRAINT "FK_ab9e737a904f4b09ea0ed9ed10b"`);
        await queryRunner.query(`ALTER TABLE "Etiqueta" DROP CONSTRAINT "FK_1803393a1af0e520fd97386fa25"`);
        await queryRunner.query(`ALTER TABLE "FormatoConfig" DROP CONSTRAINT "FK_a0ab4c0a1aad34724a2879406d4"`);
        await queryRunner.query(`ALTER TABLE "FormatoConfig" DROP CONSTRAINT "FK_529f124baf9d4f75509439ca613"`);
        await queryRunner.query(`ALTER TABLE "FormatoConfig" DROP CONSTRAINT "FK_e28195487f7704f4ffbb823783b"`);
        await queryRunner.query(`ALTER TABLE "Menu" DROP CONSTRAINT "FK_c4c5fa3bc158c089f076ec35d08"`);
        await queryRunner.query(`ALTER TABLE "UsuarioTipoMenu" DROP CONSTRAINT "FK_bc70a410a2c29f58b625c5ca2dd"`);
        await queryRunner.query(`ALTER TABLE "UsuarioTipoMenu" DROP CONSTRAINT "FK_67c44f92227b9aafc3dff4e4dc9"`);
        await queryRunner.query(`ALTER TABLE "Usuario" DROP CONSTRAINT "FK_0f585a4fc23d6070f14a2747223"`);
        await queryRunner.query(`ALTER TABLE "UsuarioQueue" DROP CONSTRAINT "FK_cefdd40723688b47b2a2fd72f8f"`);
        await queryRunner.query(`ALTER TABLE "UsuarioQueue" DROP CONSTRAINT "FK_a4ac8d9b685e8450ded72fcab4f"`);
        await queryRunner.query(`ALTER TABLE "Printer" DROP CONSTRAINT "FK_beb9563a210880e7f760ccc90d3"`);
        await queryRunner.query(`ALTER TABLE "FormatoPict" DROP CONSTRAINT "FK_baa8bac44eac365e7e48d000048"`);
        await queryRunner.query(`ALTER TABLE "FormatoPict" DROP CONSTRAINT "FK_427bbaf86e32da9d0f85e1af587"`);
        await queryRunner.query(`ALTER TABLE "FormatoRect" DROP CONSTRAINT "FK_e2b07feaa831d8cd15245a8f0e4"`);
        await queryRunner.query(`ALTER TABLE "FormatoText" DROP CONSTRAINT "FK_bfcdc1303a1869e43c7a8ce232a"`);
        await queryRunner.query(`ALTER TABLE "FormatoText" DROP CONSTRAINT "FK_7a1d5e987bb4acd463c475eb6b8"`);
        await queryRunner.query(`ALTER TABLE "Producto" DROP CONSTRAINT "FK_507854f761f4a632ae924ebf3bd"`);
        await queryRunner.query(`ALTER TABLE "ProductoDet" DROP CONSTRAINT "FK_cc127ec96a6b1293c5f1dced6cc"`);
        await queryRunner.query(`ALTER TABLE "ProductoDet" DROP CONSTRAINT "FK_a48a7f32e9cbbbef9310ca976ae"`);
        await queryRunner.query(`DROP TABLE "Etiqueta"`);
        await queryRunner.query(`DROP TABLE "FormatoConfig"`);
        await queryRunner.query(`DROP TABLE "Formato"`);
        await queryRunner.query(`DROP TABLE "Menu"`);
        await queryRunner.query(`DROP TABLE "UsuarioTipoMenu"`);
        await queryRunner.query(`DROP TABLE "UsuarioTipo"`);
        await queryRunner.query(`DROP TABLE "Usuario"`);
        await queryRunner.query(`DROP TABLE "UsuarioQueue"`);
        await queryRunner.query(`DROP TABLE "Printer"`);
        await queryRunner.query(`DROP TABLE "FormatoPict"`);
        await queryRunner.query(`DROP TABLE "Picture"`);
        await queryRunner.query(`DROP TABLE "FormatoRect"`);
        await queryRunner.query(`DROP TABLE "FormatoText"`);
        await queryRunner.query(`DROP TABLE "Fuente"`);
        await queryRunner.query(`DROP TABLE "Pais"`);
        await queryRunner.query(`DROP TABLE "Producto"`);
        await queryRunner.query(`DROP TABLE "ProductoDet"`);
        await queryRunner.query(`DROP TABLE "Language"`);
        await queryRunner.query(`DROP TABLE "Familia"`);
    }

}
