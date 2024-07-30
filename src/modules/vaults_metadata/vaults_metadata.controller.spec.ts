import { Test, TestingModule } from '@nestjs/testing';
import { VaultsMetadataController } from './vaults_metadata.controller';

describe('VaultsMetadataController', () => {
  let controller: VaultsMetadataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaultsMetadataController],
    }).compile();

    controller = module.get<VaultsMetadataController>(VaultsMetadataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
