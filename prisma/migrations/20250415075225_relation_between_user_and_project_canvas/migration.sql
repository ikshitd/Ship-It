-- CreateTable
CREATE TABLE "_UserCanvas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserCanvas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserCanvas_B_index" ON "_UserCanvas"("B");

-- AddForeignKey
ALTER TABLE "_UserCanvas" ADD CONSTRAINT "_UserCanvas_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectCanvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCanvas" ADD CONSTRAINT "_UserCanvas_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
