<?php

namespace User\Service;

use App\Models\User;
use User\Dto\UserCreateDto;
use User\Exception\DuplicatePhoneNumberException;
use User\Exception\DuplicateUserEmailException;
use User\RepositoryInterface\UserRepositoryInterface;

readonly class UserService
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ){}

    /**
     * @param UserCreateDto $userCreateDto
     * @return User
     * @throws DuplicatePhoneNumberException
     * @throws DuplicateUserEmailException
     */
    public function createUser(UserCreateDto $userCreateDto):User{
        $this->verifyNewUserEmail($userCreateDto->email);
        $this->verifyNewUserPhone($userCreateDto->phone);
        return $this->userRepository->createUser($userCreateDto);
    }

    /**
     * @throws DuplicateUserEmailException
     */
    private function verifyNewUserEmail(string $email):void{
        $user = $this->userRepository->getUserByEmail($email);
        if($user)
            throw new DuplicateUserEmailException($email);

    }

    /**
     * @throws DuplicatePhoneNumberException
     */
    private function verifyNewUserPhone(string $phone):void{
        $user = $this->userRepository->getUserByPhone($phone);
        if($user)
            throw new DuplicatePhoneNumberException($phone);
    }

}
