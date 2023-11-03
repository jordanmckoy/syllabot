// Import necessary Prisma Client and other dependencies
import { PrismaVectorStore } from "langchain/vectorstores/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PrismaClient, Prisma } from "@prisma/client";

// Instantiate the Prisma Client
const prisma = new PrismaClient();

const lorum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

const lorumMarkdown = `# Munera lenta corpora liquido vultus

## Ignis madefactis sanguine

Lorem markdownum certe [sua](http://o-vocem.net/dicite.php) sceptri partes,
**telluris aerane** vulnere, sic ita. Cognitus taurum inde atque, et maciem
sorte *innixusque* prudens. Certamine *adflata Herculeis* dum. Omni est, visa
possent *summa asper* vocem, in lupos posse nocte tertius. Quod **supervenit**
nempe **tum** valles, hic eris malo?

    var dvd = pupGuidCell.integerFiber(3 + nvramMacClone + mount, 1);
    cleanDefinitionWindow = cameraSmartphoneSearch(lossless, link_mountain);
    del(listserv, boot - adware + link * cifs_sound, hoverUnc);
    var localhost_flatbed = yahooSkyscraperHard(860375, daemon);
    flood_memory = bootComputer;

Ignes iterum Pelops. Inquit **capillis mons**.

    offline_login.screenshot(-5 * nybble);
    dllImapFile = 4 * crossplatform_dvd - bootCellBinary(osd_lock);
    chipset += hacker_blacklist_html;
    uri_filename_property.wildcardDesign(62, 890250 + 2);

## Solo in ignaroque et genus

Inque forma, deos rogant carmen, et nondum **faciente**, nisi Pylius! Dixit
vocabat tamen!

    if (payload < samba(dfs_pmu_drop) + 3 - 79) {
        jsp_directx_memory.upThirdCompression(networkDomainPrinter, hfsError,
                41);
    }
    var bitmapDdr = 4;
    hardWindow += ictMpTransfer * avatar.text(clockSoap, stationDimmIbm *
            character_logic);
    path *= bingSmartphoneLaser;
    if (2) {
        down_binary_footer = third_blu;
        barcraftEmulationHalf.on += jumper;
    }

Sperne ea omnibus esse **opto** apri Idaeis vitam robora, stantes sidera, fugit.
Deae fidissime onus nurus ortu posuit?

Loco fias, renasci [mutua](http://www.aeno-et.io/focus). Unde
[est](http://etfecit.net/) cum tardae imbres et non vidit mora *convocat* in
umbras, dum tam fatorum etiam praedaeque! Tmolo victrix corpora Edonidas et
constitit praecipiet non palude canum peti alter auro [deperderet virgo
leonis](http://qui.com/non.html) in posita
[cladis](http://www.variarum-palato.org/). Dexterior frater prosunt arva.
Praerupta Proserpina imagine Bisaltida pinus concumbere vi una aequatam cornua
dixerat culmine metaque hic apro, omni.`

// Define the Course data to be seeded
const courseData = [
    {
        name: 'Course 1',
        description: lorum,
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 2',
        description: lorum,
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 3',
        description: lorum,
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 4',
        description: lorum,
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 5',
        description: lorum,
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 6',
        description: lorum,
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 7',
        description: lorum,
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 8',
        description: lorum,
        image: 'https://random.imagecdn.app/500/150',
    },
];

async function seedCoursesAndUnits() {

    for (const data of courseData) {
        await prisma.course.create({
            data,
        });
    }

    // Use the `withModel` method to get proper type hints for `metadata` field:
    const vectorStore = PrismaVectorStore.withModel(prisma).create(
        new OpenAIEmbeddings(
            {
                openAIApiKey: process.env.OPENAI_KEY,
            }
        ),
        {
            prisma: Prisma,
            tableName: "Unit",
            vectorColumnName: "vector",
            columns: {
                id: PrismaVectorStore.IdColumn,
                content: PrismaVectorStore.ContentColumn,
            },
        }
    );

    const courses = await prisma.course.findMany();

    const units = await Promise.all(courses.map(async (course) => {
        let count = 0;
        const units = [];
        while (count < 6) {
            units.push(
                prisma.unit.create({
                    data: {
                        name: `Unit ${count + 1}`,
                        description: lorum,
                        content: lorumMarkdown,
                        courseId: course.id,
                    }
                })
            );
            count++;
        }
        return Promise.all(units);
    }));

    await vectorStore.addModels(units.flat());
}


async function main() {
    try {
        await prisma.unit.deleteMany();
        await prisma.course.deleteMany();
        await seedCoursesAndUnits();
    } catch (e) {
        throw e;
    } finally {
        await prisma.$disconnect();
    }
}

main();
