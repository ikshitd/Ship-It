-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "animated" BOOLEAN NOT NULL DEFAULT false,
    "label" TEXT,
    "markerEnd" TEXT,
    "type" TEXT NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("id")
);
