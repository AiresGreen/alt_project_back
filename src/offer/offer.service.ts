import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import {PrismaService} from "../../prisma/prisma.service";
import axios from "axios";
import {offer} from "@prisma/client";

type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type JobOfferAPI = {
  intitule: string;
  description?: string;
  dateCreation?: string;
  entreprise?: { nom: string };
  lieuTravail?: { libelle: string };
  typeContratLibelle?: string;
  commune?: string;
  departement?: string;
  domaine?: string;
  duree_hebdo?: string;
  experience?: string;
  nature_contrat?: string;
  region?: string;
  type_contract?: string;

};

type JobSearchResponse = {
  resultats: JobOfferAPI[];
};



@Injectable()
export class OfferService {
  constructor(
      private prisma: PrismaService,
  ) {
  }

  async getOfferFromFranceTravail(): Promise<JobOfferAPI[]> {
    const agentId = process.env.FRANCE_TRAVAIL_CLIENT_ID!;
    const agentSecret = process.env.FRANCE_TRAVAIL_CLIENT_SECRET!;

    try {
      // Auth
      const authResponse = await axios.post<AuthResponse>(
          'https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=/partenaire',
          new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: agentId,
            client_secret: agentSecret,
            scope: 'api_offresdemploiv2 o2dsoffre',
          }),
          {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      );

      const tokenFranceTravail = authResponse.data.access_token;

      // Offres
      const jobResponse = await axios.get<JobSearchResponse>(
          'https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search',
          {
            headers: {Authorization: `Bearer ${tokenFranceTravail}`},
            params: {},
          });
          
      return jobResponse.data.resultats;

    } catch (error) {
      console.error('[FranceTravail API] Erreur:', error);
      throw new Error('Erreur lors de la récupération des offres');

    }
  }

}



//===Offres stocke dans la BDD
/*  findAll() {
    return this.prisma.offer.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        publication_date: true,
      },
    })

  }

  findOne(id: number) {
    try {
      return this.prisma.offer.findUnique({
        where: {
          id: id,
        }
      });
    } catch (error) {
      throw new NotFoundException("Offre inexistant)");
    }
  }*/
