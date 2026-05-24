/*
  Warnings:

  - You are about to drop the column `enderecoId` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the `Endereco` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bairro` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_enderecoId_fkey";

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "enderecoId",
ADD COLUMN     "bairro" TEXT NOT NULL,
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "rua" TEXT NOT NULL;

-- DropTable
DROP TABLE "Endereco";
