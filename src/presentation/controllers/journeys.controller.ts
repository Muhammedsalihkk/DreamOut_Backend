import { Request, Response, NextFunction } from 'express';
import { StartJourneyUseCase } from '../../application/use-cases/journeys/start-journey.use-case';
import { UpdateJourneyProgressUseCase } from '../../application/use-cases/journeys/update-journey-progress.use-case';
import { AddJourneyMomentUseCase } from '../../application/use-cases/journeys/add-journey-moment.use-case';
import { CompleteJourneyUseCase } from '../../application/use-cases/journeys/complete-journey.use-case';
import { GetJourneyUseCase } from '../../application/use-cases/journeys/get-journey.use-case';
import { GetUserJourneysUseCase } from '../../application/use-cases/journeys/get-user-journeys.use-case';
import { JwtService } from '../../infrastructure/security/jwt.service';

export class JourneysController {
  constructor(
    private startJourneyUseCase: StartJourneyUseCase,
    private updateJourneyProgressUseCase: UpdateJourneyProgressUseCase,
    private addJourneyMomentUseCase: AddJourneyMomentUseCase,
    private completeJourneyUseCase: CompleteJourneyUseCase,
    private getJourneyUseCase: GetJourneyUseCase,
    private getUserJourneysUseCase: GetUserJourneysUseCase,
  ) {}

  private extractUserId(req: Request): number {
    let userId: number | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = JwtService.verifyToken<{ userId: number }>(token);
        if (decoded && decoded.userId) {
          userId = Number(decoded.userId);
        }
      } catch {
        // Token invalid or expired
      }
    }

    if (!userId && (req as any).user?.id) {
      userId = Number((req as any).user.id);
    }

    if (!userId && req.body?.userId) {
      userId = Number(req.body.userId);
    }

    return userId || 6;
  }

  async start(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const routeId = Number(req.body.routeId);
      const journey = await this.startJourneyUseCase.execute(userId, routeId);
      res.status(201).json({
        statusCode: 201,
        message: 'Journey started or resumed successfully',
        data: journey,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { currentSpotIndex, exploredSpots } = req.body;
      const journey = await this.updateJourneyProgressUseCase.execute(id, {
        currentSpotIndex: Number(currentSpotIndex ?? 0),
        exploredSpots: exploredSpots ?? [],
      });
      res.status(200).json({
        statusCode: 200,
        message: 'Journey progress updated successfully',
        data: journey,
      });
    } catch (error) {
      next(error);
    }
  }

  async addMoment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { spotId, spotName, type, mediaUrl, caption, visibility } = req.body;
      const moment = await this.addJourneyMomentUseCase.execute(id, {
        spotId: spotId ? String(spotId) : undefined,
        spotName: spotName ? String(spotName) : undefined,
        type: type || 'photo',
        mediaUrl: mediaUrl || null,
        caption: caption || null,
        visibility: visibility || 'public',
      });
      res.status(201).json({
        statusCode: 201,
        message: 'Journey moment recorded successfully',
        data: moment,
      });
    } catch (error) {
      next(error);
    }
  }

  async complete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { totalDuration } = req.body;
      const journey = await this.completeJourneyUseCase.execute(id, {
        totalDuration: totalDuration ? String(totalDuration) : undefined,
      });
      res.status(200).json({
        statusCode: 200,
        message: 'Journey completed successfully',
        data: journey,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const journey = await this.getJourneyUseCase.execute(id);
      res.status(200).json({
        statusCode: 200,
        message: 'Journey retrieved successfully',
        data: journey,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserJourneys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const journeys = await this.getUserJourneysUseCase.execute(userId);
      res.status(200).json({
        statusCode: 200,
        message: 'User journeys retrieved successfully',
        data: journeys,
      });
    } catch (error) {
      next(error);
    }
  }
}
